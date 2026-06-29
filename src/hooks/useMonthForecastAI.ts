import { useState, useEffect, useRef } from 'react';
import { MonthForecast } from '@/lib/calculations';
import { generateMonthReading, getCachedMonthReading, AIMonthReading } from '@/lib/aiMonthForecastService';

export function useMonthForecastAI(forecast: MonthForecast | null, name: string) {
  const [reading, setReading] = useState<AIMonthReading | null>(() =>
    forecast ? getCachedMonthReading(forecast) : null
  );
  const [loading, setLoading] = useState(false);
  const runningRef = useRef(false);

  useEffect(() => {
    if (!forecast || reading !== null || runningRef.current) return;
    runningRef.current = true;
    setLoading(true);
    generateMonthReading(forecast, name)
      .then(setReading)
      .catch(() => {})
      .finally(() => { setLoading(false); runningRef.current = false; });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forecast?.position1, forecast?.position3, forecast?.targetMonth, forecast?.targetYear]);

  return { reading, loading };
}
