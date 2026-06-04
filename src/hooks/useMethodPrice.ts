import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface MethodPrice {
  price_basic: number;
  price_pro: number;
}

// Кеш всех цен — заполняется одним запросом при первом обращении
const priceCache: Record<string, MethodPrice> = {};
let allPricesLoaded = false;
let loadingPromise: Promise<void> | null = null;

// Загружаем все цены одним запросом
function loadAllPrices(): Promise<void> {
  if (allPricesLoaded) return Promise.resolve();
  if (loadingPromise) return loadingPromise;

  loadingPromise = supabase
    .from("method_prices")
    .select("method_id, price_basic, price_pro")
    .then(({ data, error }) => {
      if (!error && data) {
        data.forEach((row) => {
          priceCache[row.method_id] = {
            price_basic: Number(row.price_basic),
            price_pro: Number(row.price_pro),
          };
        });
        allPricesLoaded = true;
      } else {
        loadingPromise = null; // сброс — чтобы следующий вызов попробовал снова
      }
    })
    .catch(() => {
      loadingPromise = null; // сброс при сетевой ошибке
    });

  return loadingPromise;
}

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
    loadAllPrices()
      .then(() => {
        setPrices(priceCache[methodId] ?? null);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false); // не зависаем при ошибке
      });
  }, [methodId]);

  return { prices, loading };
}
