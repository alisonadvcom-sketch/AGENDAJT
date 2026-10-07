import { useLayoutEffect, useMemo, useState } from "react";
import { CalendarDays, House, Plus, SlidersHorizontal, Users, Wallet } from "lucide-react";
import { Toaster } from "sonner";
import { apptToDraft, blankAppt, blankClient, todayISO, useBook, type ApptDraft, type ClientDraft } from "@/lib/book";
import { ApptForm, ClientForm } from "@/components/forms";
import { StudioProvider, type ViewId } from "@/components/studio";
import { AgendaView, ClientsView, FinanceView, MoreView, TodayView } from "@/components/views";
import { IconButton } from "@/components/ui";

const NAV: { id: ViewId; label: string; icon: typeof House }[] = [
  { id: "hoje", label: "Hoje", icon: House },
  { id: "agenda", label: "Agenda", icon: CalendarDays },
  { id: "clientes", label: "Clientes", icon: Users },
  { id: "caixa", label: "Caixa", icon: Wallet },
  { id: "mais", label: "Mais", icon: SlidersHorizontal },
];

export function JaniceApp() {
  const studioName = useBook((s) => s.settings.studioName);
  const clearDemo = useBook((s) => s.clearDemo);
  const hasDemo = useBook((s) => s.clients.some((c) => c.demo) || s.appointments.some((a) => a.demo));
  const [view, setView] = useState<ViewId>("hoje");
  const [menu, setMenu] = useState(false);
  const [appt, setAppt] = useState<ApptDraft | null>(null);
  const [client, setClient] = useState<ClientDraft | null>(null);

  useLayoutEffect(() => {
    useBook.getState().adoptStorage();
  }, []);

  const api = useMemo(
    () => ({
      openAppt: (draft: ApptDraft) => {
        setClient(null);
        setMenu(false);
        setAppt(draft);
      },
      openClient: (draft: ClientDraft) => {
        setAppt(null);
        setMenu(false);
        setClient(draft);
      },
      go: (next: ViewId) => setView(next),
    }),
    [],
  );

  return (
    <StudioProvider value={api}>
      <div className="min-h-dvh bg-bg text-fg md:flex">
        <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-line bg-surface md:flex">
          <div className="flex items-center gap-3 px-4 py-5">
            <span className="grid size-11 place-items-center rounded-xl bg-accent font-display text-xl text-accent-fg">
              J
            </span>
            <span>
              <span className="block font-display text-lg leading-tight">{studioName || "Janice Tarot"}</span>
              <span className="text-xs text-muted">agenda e caixa</span>
            </span>
          </div>
          <nav className="grid gap-1 px-3">
            {NAV.map((item) => (
              <NavButton key={item.id} item={item} active={view === item.id} onClick={() => setView(item.id)} />
            ))}
          </nav>
        </aside>
        <div className="min-w-0 flex-1 pb-24 md:pb-8">
          <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-line bg-bg px-4 py-3">
            <div className="min-w-0">
              <p className="truncate font-display text-xl">{studioName || "Janice Tarot"}</p>
              <p className="text-xs text-muted">{NAV.find((item) => item.id === view)?.label}</p>
            </div>
            <div className="relative">
              <IconButton aria-label="Novo" onClick={() => setMenu((open) => !open)}>
                <Plus className="size-5" />
              </IconButton>
              {menu ? (
                <>
                  <button type="button" className="fixed inset-0 z-20 cursor-default" aria-label="Fechar" onClick={() => setMenu(false)} />
                  <div className="absolute right-0 z-30 w-52 rounded-xl border border-line bg-surface p-2 shadow-sm">
                    <button
                      type="button"
                      className="h-11 w-full rounded-lg px-3 text-left text-sm hover:bg-sunken"
                      onClick={() => api.openAppt(blankAppt({ date: todayISO() }))}
                    >
                      Novo horário
                    </button>
                    <button
                      type="button"
                      className="h-11 w-full rounded-lg px-3 text-left text-sm hover:bg-sunken"
                      onClick={() => api.openClient(blankClient())}
                    >
                      Novo contato
                    </button>
                  </div>
                </>
              ) : null}
            </div>
          </header>
          <main className="mx-auto grid w-full max-w-3xl gap-4 px-4 py-5">
            {hasDemo ? (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-sunken px-4 py-3 text-sm">
                <p>Tem dados de exemplo para você ver a agenda funcionando. Apague quando for usar de verdade.</p>
                <button type="button" className="h-11 shrink-0 rounded-lg bg-surface px-3 font-medium" onClick={() => clearDemo()}>
                  Apagar exemplos
                </button>
              </div>
            ) : null}
            {view === "hoje" ? <TodayView /> : null}
            {view === "agenda" ? <AgendaView /> : null}
            {view === "clientes" ? <ClientsView /> : null}
            {view === "caixa" ? <FinanceView /> : null}
            {view === "mais" ? <MoreView /> : null}
          </main>
        </div>
        <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-5 border-t border-line bg-surface md:hidden">
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setView(item.id)}
              className={"flex h-16 flex-col items-center justify-center gap-1 text-xs " + (view === item.id ? "text-accent" : "text-muted")}
            >
              <item.icon className="size-5" strokeWidth={view === item.id ? 2.25 : 1.75} />
              {item.label}
            </button>
          ))}
        </nav>
      </div>
      {appt ? (
        <ApptForm
          key={appt.id ?? "novo-horario"}
          draft={appt}
          onClose={() => setAppt(null)}
        />
      ) : null}
      {client ? (
        <ClientForm
          key={client.id ?? "novo-contato"}
          draft={client}
          onClose={() => setClient(null)}
          onBook={(prefill) => api.openAppt(blankAppt(prefill))}
          onOpenAppointment={(appointment) => {
            api.openAppt(apptToDraft(appointment, useBook.getState().clients));
          }}
        />
      ) : null}
      <Toaster position="top-center" />
    </StudioProvider>
  );
}

function NavButton({
  item,
  active,
  onClick,
}: {
  item: (typeof NAV)[number];
  active: boolean;
  onClick: () => void;
}) {
  const Icon = item.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "flex h-11 items-center gap-3 rounded-lg px-3 text-left text-sm " +
        (active ? "bg-sunken font-medium text-accent" : "text-fg")
      }
    >
      <Icon className="size-5" />
      {item.label}
    </button>
  );
}
