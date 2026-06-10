import { useState, useEffect, useRef } from 'react';
import { CompatibilityResult } from '@/lib/calculations';
import { generateAIReading, AIReading } from '@/lib/aiReadingService';

interface UseAIReadingResult {
  reading: AIReading | null;
  loading: boolean;
}

export function useAIReading(result: CompatibilityResult, enabled: boolean): UseAIReadingResult {
  const [reading, setReading] = useState<AIReading | null>(null);
  const [loading, setLoading] = useState(false);
  const runningRef = useRef(false);

  useEffect(() => {
    if (!enabled || runningRef.current) return;
    runningRef.current = true;
    setLoading(true);
    generateAIReading(result)
      .then(setReading)
      .catch(() => {/* silent — fallback to static */})
      .finally(() => { setLoading(false); runningRef.current = false; });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  return { reading, loading };
}
