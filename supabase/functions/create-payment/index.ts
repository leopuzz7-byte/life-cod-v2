// ============================================================
// Edge Function: create-payment  (Робокасса)
// Поддерживает тарифы: basic (бесплатный) и professional (платный).
// Цены берутся из method_prices.price_basic / price_pro — НИКОГДА с фронта.
// ============================================================

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";
import { crypto } from "https://deno.land/std@0.224.0/crypto/mod.ts";

async function md5(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("MD5", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "Не авторизован" }, 401);

    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: { user }, error: userErr } = await userClient.auth.getUser();
    if (userErr || !user) return json({ error: "Не авторизован" }, 401);

    const { method_id, tier } = await req.json();
    if (!method_id) return json({ error: "Не указан method_id" }, 400);

    // tier: "basic" | "professional" — по умолчанию professional
    const isPro = !tier || tier === "professional";

    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: priceRow, error: priceErr } = await adminClient
      .from("method_prices")
      .select("title, price_basic, price_pro, is_active")
      .eq("method_id", method_id)
      .maybeSingle();

    if (priceErr || !priceRow) return json({ error: "Методика не найдена" }, 404);
    if (!priceRow.is_active) return json({ error: "Методика недоступна" }, 400);

    const amount = isPro ? Number(priceRow.price_pro) : Number(priceRow.price_basic);

    // Если базовый бесплатный — не создаём платёж, сразу возвращаем success
    if (amount === 0) {
      return json({ free: true, order_id: null });
    }

    const isTest = (Deno.env.get("ROBOKASSA_IS_TEST") ?? "true") === "true";

    const { data: invData, error: invErr } = await adminClient.rpc("next_inv_id");
    if (invErr || invData == null) return json({ error: "Ошибка генерации номера заказа" }, 500);
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
        payment_provider: "robokassa",
        tier: isPro ? "professional" : "basic",
      })
      .select("id, inv_id")
      .single();

    if (orderErr || !order) return json({ error: "Не удалось создать заказ: " + orderErr?.message }, 500);

    const login = Deno.env.get("ROBOKASSA_LOGIN")!;
    const pass1 = isTest
      ? Deno.env.get("ROBOKASSA_PASS1_TEST")!
      : Deno.env.get("ROBOKASSA_PASS1")!;

    const outSum = amount.toFixed(2);
    const signature = await md5(`${login}:${outSum}:${order.inv_id}:${pass1}`);

    const params = new URLSearchParams({
      MerchantLogin: login,
      OutSum: outSum,
      InvId: String(order.inv_id),
      Description: `${priceRow.title} (${isPro ? "Профессиональный" : "Базовый"})`,
      SignatureValue: signature,
      Culture: "ru",
      Encoding: "utf-8",
    });
    if (isTest) params.set("IsTest", "1");

    const paymentUrl = "https://auth.robokassa.ru/Merchant/Index.aspx?" + params.toString();
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
