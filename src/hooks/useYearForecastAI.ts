import { useState, useEffect, useRef } from 'react';
import { YearForecast } from '@/lib/calculations';
import { generateYearReading, getCachedYearReading, AIYearReading } from '@/lib/aiYearForecastService';

export function useYearForecastAI(forecast: YearForecast | null, name: string) {
  const [reading, setReading] = useState<AIYearReading | null>(() =>
    forecast ? getCachedYearReading(forecast) : null
  );
  const [loading, setLoading] = useState(false);
  const runningRef = useRef(false);

  useEffect(() => {
    if (!forecast || reading !== null || runningRef.current) return;
    runningRef.current = true;
    setLoading(true);
    generateYearReading(forecast, name)
      .then(setReading)
      .catch(() => {})
      .finally(() => { setLoading(false); runningRef.current = false; });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forecast?.arcana, forecast?.targetYear]);

  return { reading, loading };
}
