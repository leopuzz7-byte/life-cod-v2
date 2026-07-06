import { createContext, useContext, useState, ReactNode } from "react";

export type MysticMode = "symbols" | "digits";

const MysticModeContext = createContext<{ mode: MysticMode; setMode: (m: MysticMode) => void }>({
  mode: "symbols",
  setMode: () => {},
});

export function MysticModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<MysticMode>("symbols");
  return <MysticModeContext.Provider value={{ mode, setMode }}>{children}</MysticModeContext.Provider>;
}

export const useMysticMode = () => useContext(MysticModeContext);
