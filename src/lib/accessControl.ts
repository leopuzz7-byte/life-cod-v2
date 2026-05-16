// Система управления доступом к разборам
import { useState, useCallback, createContext, useContext, createElement, type ReactNode } from "react";

export type AccessState = 'locked' | 'preview' | 'payment_pending' | 'unlocked';

export interface AccessInfo {
  state: AccessState;
  analysisType: string;
  tier: 'basic' | 'professional';
}

interface AccessContextType {
  accessState: AccessState;
  unlock: () => void;
  lock: () => void;
  startPayment: () => void;
  isDevMode: boolean;
  toggleDevMode: () => void;
}

const AccessContext = createContext<AccessContextType | null>(null);

export function AccessProvider({ children }: { children: ReactNode }) {
  const [accessState, setAccessState] = useState<AccessState>('locked');
  const [isDevMode, setIsDevMode] = useState(() => {
    return localStorage.getItem('lifecod-dev-mode') === 'true';
  });

  const unlock = useCallback(() => setAccessState('unlocked'), []);
  const lock = useCallback(() => setAccessState('locked'), []);
  const startPayment = useCallback(() => setAccessState('payment_pending'), []);
  const toggleDevMode = useCallback(() => {
    setIsDevMode(prev => {
      const next = !prev;
      localStorage.setItem('lifecod-dev-mode', String(next));
      return next;
    });
  }, []);

  return createElement(
    AccessContext.Provider,
    { value: { accessState, unlock, lock, startPayment, isDevMode, toggleDevMode } },
    children
  );
}

export function useAccess() {
  const ctx = useContext(AccessContext);
  if (!ctx) throw new Error("useAccess must be used within AccessProvider");
  return ctx;
}
