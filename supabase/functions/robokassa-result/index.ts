// ============================================================
// Edge Function: robokassa-result
//
// Эту функцию вызывает САМА РОБОКАССА после оплаты (ResultURL).
// Не фронтенд, не пользователь — сервер Робокассы.
//
// Что делает:
//  1. Принимает от Робокассы OutSum, InvId, SignatureValue
//  2. Проверяет подпись паролем #2 — это доказывает, что
//     запрос реально от Робокассы, а не от злоумышленника
//  3. Сверяет сумму с заказом в БД
//  4. Помечает заказ как 'paid'
//  5. Отвечает Робокассе "OK{InvId}" — иначе она будет повторять запрос
//
// Секреты:
//  ROBOKASSA_PASS2          — пароль #2 (боевой)
//  ROBOKASSA_PASS2_TEST     — пароль #2 (тестовый)
// ============================================================

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { crypto } from "https://deno.land/std@0.224.0/crypto/mod.ts";

async function md5(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("MD5", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

Deno.serve(async (req) => {
  try {
    // Робокасса может слать данные и POST-форму, и GET-параметрами.
    let params: URLSearchParams;
    if (req.method === "POST") {
      const body = await req.text();
      params = new URLSearchParams(body);
    } else {
      params = new URL(req.url).searchParams;
    }

    const outSum = params.get("OutSum") ?? "";
    const invId = params.get("InvId") ?? "";
    const signature = (params.get("SignatureValue") ?? "").toLowerCase();

    if (!outSum || !invId || !signature) {
      return new Response("bad request", { status: 400 });
    }

    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Находим заказ — нужно знать, тестовый он или боевой,
    // чтобы взять правильный пароль для проверки подписи.
    const { data: order, error: orderErr } = await adminClient
      .from("orders")
      .select("id, amount_rub, status, is_test")
      .eq("inv_id", Number(invId))
      .maybeSingle();

    if (orderErr || !order) {
      return new Response("order not found", { status: 404 });
    }

    // --- Проверка подписи ---
    // Робокасса считает: MD5(OutSum:InvId:Пароль#2)
    const pass2 = order.is_test
      ? Deno.env.get("ROBOKASSA_PASS2_TEST")!
      : Deno.env.get("ROBOKASSA_PASS2")!;

    const expected = (await md5(`${outSum}:${invId}:${pass2}`)).toLowerCase();

    if (expected !== signature) {
      // Подпись не сошлась — это НЕ Робокасса. Игнорируем.
      return new Response("bad signature", { status: 400 });
    }

    // --- Сверка суммы ---
    // Защита: вдруг пришла сумма меньше, чем стоит заказ.
    if (Number(outSum) !== Number(order.amount_rub)) {
      return new Response("amount mismatch", { status: 400 });
    }

    // --- Помечаем оплаченным (идемпотентно) ---
    // Если заказ уже 'paid' — просто повторно отвечаем OK,
    // Робокасса иногда шлёт уведомление дважды.
    if (order.status !== "paid") {
      const { error: updErr } = await adminClient
        .from("orders")
        .update({ status: "paid", paid_at: new Date().toISOString() })
        .eq("id", order.id);

      if (updErr) {
        return new Response("db error", { status: 500 });
      }
    }

    // Робокасса ждёт именно такой ответ, иначе будет слать повторы.
    return new Response(`OK${invId}`, { status: 200 });
  } catch (_e) {
    return new Response("server error", { status: 500 });
  }
});
