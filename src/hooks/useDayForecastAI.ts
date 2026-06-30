import { useState, useEffect, useRef, useCallback } from 'react';
import { DailyForecastResult } from '@/lib/dailyForecast';
import { generateDayReading, getCachedDayReading, AIDayReading } from '@/lib/aiDayForecastService';

export function useDayForecastAI(result: DailyForecastResult | null, name: string) {
  const [reading, setReading] = useState<AIDayReading | null>(() =>
    result ? getCachedDayReading(result) : null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const runningRef = useRef(false);

  const run = useCallback(() => {
    if (!result || runningRef.current) return;
    runningRef.current = true;
    setLoading(true);
    setError(null);
    generateDayReading(result, name)
      .then(setReading)
      .catch((e) => setError(e?.message || 'Не удалось сгенерировать прогноз'))
      .finally(() => { setLoading(false); runningRef.current = false; });
  }, [result, name]);

  useEffect(() => {
    if (!result || reading !== null || runningRef.current) return;
    run();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result?.targetDate.day, result?.targetDate.month, result?.targetDate.year]);

  const reload = useCallback(() => {
    setReading(null);
    runningRef.current = false;
    run();
  }, [run]);

  return { reading, loading, error, reload };
}
