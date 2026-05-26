// ============================================================
// Edge Function: payment-status
//
// Фронт зовёт её, чтобы узнать статус заказа после возврата
// с оплаты. Возвращает status: pending | paid | failed.
//
// Пользователь видит только СВОИ заказы (проверка по user_id).
// ============================================================

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return json({ error: "Не авторизован" }, 401);
    }

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

    const { order_id } = await req.json();
    if (!order_id) {
      return json({ error: "Не указан order_id" }, 400);
    }

    // RLS сам ограничит выборку заказами этого пользователя.
    const { data: order, error } = await userClient
      .from("orders")
      .select("id, status, method_id, amount_rub, paid_at")
      .eq("id", order_id)
      .maybeSingle();

    if (error || !order) {
      return json({ error: "Заказ не найден" }, 404);
    }

    return json({
      status: order.status,
      method_id: order.method_id,
      amount_rub: order.amount_rub,
      paid_at: order.paid_at,
    });
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
