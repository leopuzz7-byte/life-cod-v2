import { useState, useEffect, useRef } from 'react';
import { CompatibilityResult } from '@/lib/calculations';
import { generatePersonalReading, PersonalReading } from '@/lib/aiPersonalService';

interface UsePersonalReadingResult {
  reading: PersonalReading | null;
  loading: boolean;
}

export function usePersonalReading(
  result: CompatibilityResult,
  person: 1 | 2,
  enabled: boolean
): UsePersonalReadingResult {
  const [reading, setReading] = useState<PersonalReading | null>(null);
  const [loading, setLoading] = useState(false);
  const runningRef = useRef(false);

  useEffect(() => {
    if (!enabled || runningRef.current) return;
    runningRef.current = true;
    setLoading(true);
    generatePersonalReading(result, person)
      .then(setReading)
      .catch(() => {/* silent - fallback to static */})
      .finally(() => { setLoading(false); runningRef.current = false; });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  return { reading, loading };
}
