import { useState, useEffect, useRef } from 'react';
import { CompatibilityResult } from '@/lib/calculations';
import { generateAIReading, getCachedAIReading, AIReading } from '@/lib/aiReadingService';

export function useAIReading(result: CompatibilityResult, enabled: boolean) {
  const [reading, setReading] = useState<AIReading | null>(() =>
    enabled ? getCachedAIReading(result) : null
  );
  const [loading, setLoading] = useState(false);
  const runningRef = useRef(false);

  useEffect(() => {
    if (!enabled || reading !== null || runningRef.current) return;
    runningRef.current = true;
    setLoading(true);
    generateAIReading(result)
      .then(setReading)
      .catch(() => {})
      .finally(() => { setLoading(false); runningRef.current = false; });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  return { reading, loading };
}
