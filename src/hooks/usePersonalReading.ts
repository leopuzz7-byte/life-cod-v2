import { useState, useEffect, useRef } from 'react';
import { CompatibilityResult } from '@/lib/calculations';
import { generatePersonalReading, getCachedPersonalReading, AIPersonalReading } from '@/lib/aiPersonalService';

export function usePersonalReading(result: CompatibilityResult, person: 1 | 2, enabled: boolean) {
  const [reading, setReading] = useState<AIPersonalReading | null>(() =>
    enabled ? getCachedPersonalReading(result, person) : null
  );
  const [loading, setLoading] = useState(false);
  const runningRef = useRef(false);

  useEffect(() => {
    if (!enabled || reading !== null || runningRef.current) return;
    runningRef.current = true;
    setLoading(true);
    generatePersonalReading(result, person)
      .then(setReading)
      .catch(() => {})
      .finally(() => { setLoading(false); runningRef.current = false; });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  return { reading, loading };
}
