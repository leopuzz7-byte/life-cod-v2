import { useState, useEffect, useRef } from 'react';
import { DailyForecastResult } from '@/lib/dailyForecast';
import { generateDayReading, AIDayReading } from '@/lib/aiDayForecastService';

interface UseDayForecastAIResult {
  reading: AIDayReading | null;
  loading: boolean;
}

export function useDayForecastAI(
  result: DailyForecastResult | null,
  name: string
): UseDayForecastAIResult {
  const [reading, setReading] = useState<AIDayReading | null>(null);
  const [loading, setLoading] = useState(false);
  const runningRef = useRef(false);

  useEffect(() => {
    if (!result || runningRef.current) return;
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
