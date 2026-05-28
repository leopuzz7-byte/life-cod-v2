import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface MethodPrice {
  price_basic: number;
  price_pro: number;
}

// Кеш цен в памяти — чтобы не дёргать БД при каждом переключении методики
const priceCache: Record<string, MethodPrice> = {};

export function useMethodPrice(methodId: string) {
  const [prices, setPrices] = useState<MethodPrice | null>(() => priceCache[methodId] ?? null);
  const [loading, setLoading] = useState(!priceCache[methodId]);

  useEffect(() => {
    if (priceCache[methodId]) {
      setPrices(priceCache[methodId]);
      setLoading(false);
      return;
    }

    setLoading(true);
    supabase
      .from("method_prices")
      .select("price_basic, price_pro")
      .eq("method_id", methodId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!error && data) {
          const p = { price_basic: Number(data.price_basic), price_pro: Number(data.price_pro) };
          priceCache[methodId] = p;
          setPrices(p);
        }
        setLoading(false);
      });
  }, [methodId]);

  return { prices, loading };
}
