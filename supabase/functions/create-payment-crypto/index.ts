// ============================================================
// Edge Function: create-payment-crypto  (Plisio)
//
// Создаёт крипто-платёж через Plisio.
//  1. Проверяет авторизацию пользователя
//  2. Берёт цену методики ИЗ БД (не с фронта)
//  3. Создаёт заказ в orders (status 'pending', provider 'plisio')
//  4. Создаёт инвойс в Plisio API, возвращает ссылку на оплату
//
// Секреты (Supabase -> Edge Functions -> Secrets):
//  PLISIO_SECRET_KEY  - Secret Key из дашборда Plisio (API settings)
//  SITE_URL           - адрес сайта, напр. https://life-cod-v2.vercel.app
// ============================================================

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "Не авторизован" }, 401);

    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const {
      data: { user },
      error: userErr,
    } = await userClient.auth.getUser();
    if (userErr || !user) return json({ error: "Не авторизован" }, 401);

    const { method_id } = await req.json();
    if (!method_id) return json({ error: "Не указан method_id" }, 400);

    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Цена из БД
    const { data: priceRow, error: priceErr } = await adminClient
      .from("method_prices")
      .select("title, price_rub, is_active")
      .eq("method_id", method_id)
      .maybeSingle();

    if (priceErr || !priceRow) return json({ error: "Методика не найдена" }, 404);
    if (!priceRow.is_active) return json({ error: "Методика недоступна" }, 400);

    const amountRub = Number(priceRow.price_rub);

    // inv_id
    const { data: invData, error: invErr } = await adminClient.rpc("next_inv_id");
    if (invErr || invData == null) {
      return json({ error: "Не удалось сгенерировать номер заказа" }, 500);
    }
    const invId = Number(invData);

    // Создаём заказ
    const { data: order, error: orderErr } = await adminClient
      .from("orders")
      .insert({
        user_id: user.id,
        method_id,
        amount_rub: amountRub,
        status: "pending",
        inv_id: invId,
        is_test: false,
        payment_provider: "plisio",
      })
      .select("id, inv_id")
      .single();

    if (orderErr || !order) {
      return json({ error: "Не удалось создать заказ: " + orderErr?.message }, 500);
    }

    // --- Запрос к Plisio API ---
    const secretKey = Deno.env.get("PLISIO_SECRET_KEY")!;
    const siteUrl = Deno.env.get("SITE_URL") ?? "https://life-cod-v2.vercel.app";
    const projectUrl = Deno.env.get("SUPABASE_URL")!;

    // Plisio: GET /api/v1/invoices/new с query-параметрами.
    // json=true обязателен — тогда webhook придёт в JSON-формате.
    const params = new URLSearchParams({
      api_key: secretKey,
      order_name: `Разбор: ${priceRow.title}`,
      order_number: String(order.inv_id),
      source_currency: "RUB",
      source_amount: amountRub.toFixed(2),
      currency: "USDT",          // USDT в сети Ethereum (ERC-20) — то, что включено в магазине Plisio
      callback_url: `${projectUrl}/functions/v1/plisio-webhook?json=true`,
      success_callback_url: `${siteUrl}/payment/success`,
      fail_callback_url: `${siteUrl}/payment/fail`,
      success_invoice_url: `${siteUrl}/payment/success`,
      fail_invoice_url: `${siteUrl}/payment/fail`,
      expire_min: "60",
    });

    const plisioRes = await fetch(
      `https://api.plisio.net/api/v1/invoices/new?${params.toString()}`
    );
    const plisioData = await plisioRes.json();

    if (plisioData.status !== "success" || !plisioData.data?.invoice_url) {
      return json(
        { error: "Plisio отклонил запрос: " + JSON.stringify(plisioData) },
        500
      );
    }

    // Сохраним txn_id Plisio в заказе
    await adminClient
      .from("orders")
      .update({ provider_payment_id: plisioData.data.txn_id })
      .eq("id", order.id);

    return json({ payment_url: plisioData.data.invoice_url, order_id: order.id });
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
