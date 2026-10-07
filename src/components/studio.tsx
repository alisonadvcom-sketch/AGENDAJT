import { createContext, useContext, type ReactNode } from "react";
import type { ApptDraft, ClientDraft } from "@/lib/book";

export type ViewId = "hoje" | "agenda" | "clientes" | "caixa" | "mais";

type StudioApi = {
  openAppt: (draft: ApptDraft) => void;
  openClient: (draft: ClientDraft) => void;
  go: (view: ViewId) => void;
};

const StudioContext = createContext<StudioApi | null>(null);

export function StudioProvider({ value, children }: { value: StudioApi; children: ReactNode }) {
  return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>;
}

export function useStudio() {
  const ctx = useContext(StudioContext);
  if (!ctx) throw new Error("Fora do estúdio");
  return ctx;
}
