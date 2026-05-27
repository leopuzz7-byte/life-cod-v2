// ============================================================
// Edge Function: plisio-webhook
//
// Plisio вызывает её при изменении статуса платежа (POST).
//  1. Проверяет подпись verify_hash (HMAC-SHA1 с PLISIO_SECRET_KEY)
//  2. Если статус "completed" - помечает заказ оплаченным
//
// Секрет:
//  PLISIO_SECRET_KEY  - тот же ключ, что в create-payment-crypto
//
// Важно: инвойс создаётся с callback_url ...?json=true,
// поэтому Plisio шлёт тело как JSON, а verify_hash считается
// HMAC-SHA1 от JSON-строки данных без самого поля verify_hash.
// ============================================================

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// HMAC-SHA1 -> hex
async function hmacSha1Hex(message: string, key: string): Promise<string> {
  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(key),
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, enc.encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

Deno.serve(async (req) => {
  try {
    const raw = await req.text();

    // Plisio в json-режиме шлёт application/json
    let body: Record<string, unknown>;
    try {
      body = JSON.parse(raw);
    } catch {
      // fallback — на случай form-encoded
      const params = new URLSearchParams(raw);
      body = Object.fromEntries(params.entries());
    }

    const verifyHash = body.verify_hash as string | undefined;
    if (!verifyHash) {
      return new Response("no verify_hash", { status: 403 });
    }

    const secretKey = Deno.env.get("PLISIO_SECRET_KEY")!;

    // Пересобираем данные без verify_hash, сортируем ключи,
    // считаем HMAC-SHA1 от JSON-строки.
    const { verify_hash: _omit, ...rest } = body;
    const sortedKeys = Object.keys(rest).sort();
    const ordered: Record<string, unknown> = {};
    for (const k of sortedKeys) ordered[k] = rest[k];
    const dataString = JSON.stringify(ordered);

    const expected = await hmacSha1Hex(dataString, secretKey);

    if (expected !== verifyHash) {
      // Подпись не сошлась — отвечаем 200, чтобы Plisio не зацикливал ретраи,
      // но заказ НЕ трогаем.
      return new Response("bad hash", { status: 403 });
    }

    const invId = Number(body.order_number);
    const status = String(body.status ?? "");

    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: order, error: orderErr } = await adminClient
      .from("orders")
      .select("id, status")
      .eq("inv_id", invId)
      .maybeSingle();

    if (orderErr || !order) {
      return new Response("order not found", { status: 404 });
    }

    // Plisio статусы: new, pending, completed, error, expired,
    //                 mismatch, cancelled
    if (status === "completed" && order.status !== "paid") {
      const { error: updErr } = await adminClient
        .from("orders")
        .update({ status: "paid", paid_at: new Date().toISOString() })
        .eq("id", order.id);
      if (updErr) return new Response("db error", { status: 500 });
    } else if (
      (status === "error" || status === "expired" || status === "cancelled") &&
      order.status === "pending"
    ) {
      await adminClient
        .from("orders")
        .update({ status: "failed" })
        .eq("id", order.id);
    }

    return new Response("OK", { status: 200 });
  } catch (_e) {
    return new Response("server error", { status: 500 });
  }
});
