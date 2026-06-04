// ============================================================
// Edge Function: create-payment-crypto  (Plisio)
// Поддерживает тарифы basic/professional, цены из БД.
// ============================================================

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";
import { crypto } from "https://deno.land/std@0.224.0/crypto/mod.ts";

async function makeSign(bodyJson: string, apiKey: string): Promise<string> {
  const base64 = btoa(bodyJson);
  const data = new TextEncoder().encode(base64 + apiKey);
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

    if (amount === 0) return json({ free: true, order_id: null });

    // Plisio минимум ~$10 (≈800₽ для USDT ERC-20)
    if (amount < 800) {
      return json({ error: "Минимальная сумма для оплаты криптой — 800 ₽. Воспользуйтесь оплатой картой." }, 400);
    }

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
        is_test: false,
        payment_provider: "plisio",
        tier: isPro ? "professional" : "basic",
      })
      .select("id, inv_id")
      .single();

    if (orderErr || !order) return json({ error: "Не удалось создать заказ: " + orderErr?.message }, 500);

    const secretKey = Deno.env.get("PLISIO_SECRET_KEY")!;
    const siteUrl = Deno.env.get("SITE_URL") ?? "https://life-cod-v2.vercel.app";
    const projectUrl = Deno.env.get("SUPABASE_URL")!;

    const payload = {
      amount: amount.toFixed(2),
      currency: "USDT",
      source_currency: "RUB",
      source_amount: amount.toFixed(2),
      order_id: String(order.inv_id),
      order_name: `${priceRow.title} (${isPro ? "Профессиональный" : "Базовый"})`,
      url_return: `${siteUrl}/payment/fail`,
      url_success: `${siteUrl}/payment/success`,
      url_callback: `${projectUrl}/functions/v1/plisio-webhook?json=true`,
      expire_min: "60",
    };

    const params = new URLSearchParams({
      api_key: secretKey,
      ...Object.fromEntries(Object.entries(payload).map(([k, v]) => [k, String(v)])),
    });

    const plisioRes = await fetch(`https://api.plisio.net/api/v1/invoices/new?${params.toString()}`);
    const plisioData = await plisioRes.json();

    if (plisioData.status !== "success" || !plisioData.data?.invoice_url) {
      return json({ error: "Plisio: " + JSON.stringify(plisioData) }, 500);
    }

    await adminClient.from("orders").update({ provider_payment_id: plisioData.data.txn_id }).eq("id", order.id);

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
