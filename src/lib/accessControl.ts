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
}

const AccessContext = createContext<AccessContextType | null>(null);

export function AccessProvider({ children }: { children: ReactNode }) {
  const [accessState, setAccessState] = useState<AccessState>('locked');

  const unlock = useCallback(() => setAccessState('unlocked'), []);
  const lock = useCallback(() => setAccessState('locked'), []);
  const startPayment = useCallback(() => setAccessState('payment_pending'), []);

  return createElement(
    AccessContext.Provider,
    { value: { accessState, unlock, lock, startPayment } },
    children
  );
}

export function useAccess() {
  const ctx = useContext(AccessContext);
  if (!ctx) throw new Error("useAccess must be used within AccessProvider");
  return ctx;
}
