// ============================================================
// Edge Function: create-payment
//
// Что делает:
//  1. Принимает от фронта { method_id }
//  2. Проверяет что пользователь авторизован (по JWT)
//  3. Берёт ЦЕНУ ИЗ БД (не с фронта!) — иначе цену можно подделать
//  4. Создаёт заказ в таблице orders со статусом 'pending'
//  5. Формирует подписанную ссылку на оплату Робокассы и возвращает её
//
// Секреты (задаются в Supabase → Edge Functions → Secrets):
//  ROBOKASSA_LOGIN          — идентификатор магазина
//  ROBOKASSA_PASS1          — пароль #1 (боевой)
//  ROBOKASSA_PASS1_TEST     — пароль #1 (тестовый)
//  ROBOKASSA_IS_TEST        — "true" пока тестируем, потом "false"
// ============================================================

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

// MD5 — Робокасса требует именно MD5 для подписи.
import { crypto } from "https://deno.land/std@0.224.0/crypto/mod.ts";

async function md5(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("MD5", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // --- 1. Авторизация пользователя ---
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return json({ error: "Не авторизован" }, 401);
    }

    // Клиент с правами пользователя — чтобы узнать кто он
    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const {
      data: { user },
      error: userErr,
    } = await userClient.auth.getUser();
    if (userErr || !user) {
      return json({ error: "Не авторизован" }, 401);
    }

    // --- 2. Что покупаем ---
    const { method_id } = await req.json();
    if (!method_id || typeof method_id !== "string") {
      return json({ error: "Не указан method_id" }, 400);
    }

    // Админский клиент — обходит RLS, чтобы создать заказ
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // --- 3. Цена ИЗ БД ---
    const { data: priceRow, error: priceErr } = await adminClient
      .from("method_prices")
      .select("title, price_rub, is_active")
      .eq("method_id", method_id)
      .maybeSingle();

    if (priceErr || !priceRow) {
      return json({ error: "Методика не найдена" }, 404);
    }
    if (!priceRow.is_active) {
      return json({ error: "Методика недоступна для покупки" }, 400);
    }

    const amount = Number(priceRow.price_rub);

    // --- 4. Создаём заказ ---
    const isTest = (Deno.env.get("ROBOKASSA_IS_TEST") ?? "true") === "true";

    // inv_id — целое число для Робокассы. Берём через SQL-функцию next_inv_id()
    // (создаётся миграцией 02_inv_id_function.sql).
    const { data: invData, error: invErr } = await adminClient.rpc(
      "next_inv_id"
    );

    if (invErr || invData == null) {
      return json(
        { error: "Не удалось сгенерировать номер заказа: " + invErr?.message },
        500
      );
    }
    const invId = Number(invData);

    const { data: order, error: orderErr } = await adminClient
      .from("orders")
      .insert({
        user_id: user.id,
        method_id,
        amount_rub: amount,
        status: "pending",
        inv_id: invId,
        is_test: isTest,
      })
      .select("id, inv_id")
      .single();

    if (orderErr || !order) {
      return json({ error: "Не удалось создать заказ: " + orderErr?.message }, 500);
    }

    // --- 5. Подписанная ссылка на Робокассу ---
    const login = Deno.env.get("ROBOKASSA_LOGIN")!;
    const pass1 = isTest
      ? Deno.env.get("ROBOKASSA_PASS1_TEST")!
      : Deno.env.get("ROBOKASSA_PASS1")!;

    // Сумма в формате с двумя знаками
    const outSum = amount.toFixed(2);

    // Подпись Робокассы: MD5(login:outSum:invId:pass1)
    const signature = await md5(`${login}:${outSum}:${order.inv_id}:${pass1}`);

    const params = new URLSearchParams({
      MerchantLogin: login,
      OutSum: outSum,
      InvId: String(order.inv_id),
      Description: `Разбор: ${priceRow.title}`,
      SignatureValue: signature,
      Culture: "ru",
      Encoding: "utf-8",
    });
    if (isTest) params.set("IsTest", "1");

    const paymentUrl =
      "https://auth.robokassa.ru/Merchant/Index.aspx?" + params.toString();

    return json({ payment_url: paymentUrl, order_id: order.id });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Ошибка сервера" }, 500);
  }
});

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
