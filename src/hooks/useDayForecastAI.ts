import { useState, useEffect, useRef } from 'react';
import { DailyForecastResult } from '@/lib/dailyForecast';
import { generateDayReading, getCachedDayReading, AIDayReading } from '@/lib/aiDayForecastService';

export function useDayForecastAI(result: DailyForecastResult | null, name: string) {
  const [reading, setReading] = useState<AIDayReading | null>(() =>
    result ? getCachedDayReading(result) : null
  );
  const [loading, setLoading] = useState(false);
  const runningRef = useRef(false);

  useEffect(() => {
    if (!result || reading !== null || runningRef.current) return;
    runningRef.current = true;
    setLoading(true);
    generateDayReading(result, name)
      .then(setReading)
      .catch(() => {})
      .finally(() => { setLoading(false); runningRef.current = false; });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result?.targetDate.day, result?.targetDate.month, result?.targetDate.year]);

  return { reading, loading };
}
