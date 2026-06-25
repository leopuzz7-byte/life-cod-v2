import { useState, useEffect, useRef } from 'react';
import { YearForecast } from '@/lib/calculations';
import { generateYearReading, AIYearReading } from '@/lib/aiYearForecastService';

interface UseYearForecastAIResult {
  reading: AIYearReading | null;
  loading: boolean;
}

export function useYearForecastAI(
  forecast: YearForecast | null,
  name: string
): UseYearForecastAIResult {
  const [reading, setReading] = useState<AIYearReading | null>(null);
  const [loading, setLoading] = useState(false);
  const runningRef = useRef(false);

  useEffect(() => {
    if (!forecast || runningRef.current) return;
    runningRef.current = true;
    setLoading(true);
    generateYearReading(forecast, name)
      .then(setReading)
      .catch(() => {/* silent - fallback to static */})
      .finally(() => { setLoading(false); runningRef.current = false; });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forecast?.arcana, forecast?.targetYear]);

  return { reading, loading };
}
