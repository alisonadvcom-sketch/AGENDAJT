import { useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  PAY_LABEL,
  VISIT_LABEL,
  appointmentsCsv,
  apptName,
  apptToDraft,
  backupJson,
  blankAppt,
  blankClient,
  clientToDraft,
  clientsCsv,
  compareAppt,
  downloadText,
  dueReminders,
  formatDay,
  formatMonth,
  formatShort,
  greeting,
  inMonth,
  initials,
  isOpenPayment,
  money,
  monthCells,
  norm,
  parseMoney,
  shiftMonth,
  statsFor,
  todayISO,
  upcomingBirthdays,
  useBook,
  weekDays,
  weekIndex,
  weekLabel,
  type Appointment,
  type Book,
  type PayStatus,
} from "@/lib/book";
import { looksLikeBackup, parseBackup, parseContactsCsv, parseVcards } from "@/lib/io";
import { useStudio } from "@/components/studio";
import { Button, Card, Choice, Field, IconButton, PayPill, TextInput } from "@/components/ui";

function payText(a: Appointment) {
  if (a.payStatus === "combinado" && a.payDueDate) return `Vai pagar ${formatShort(a.payDueDate)}`;
  return PAY_LABEL[a.payStatus];
}

export function ApptCard({ a, showDate = false }: { a: Appointment; showDate?: boolean }) {
  const clients = useBook((s) => s.clients);
  const markPaid = useBook((s) => s.markPaid);
  const { openAppt } = useStudio();
  return (
    <article className="rounded-xl border border-line bg-surface p-3">
      <button type="button" onClick={() => openAppt(apptToDraft(a, clients))} className="w-full text-left">
        <div className="flex items-baseline justify-between gap-3">
          <p className="min-w-0 truncate font-medium">{apptName(a, clients)}</p>
          <p className="shrink-0 text-sm tabular-nums text-muted">
            {showDate ? formatShort(a.date) : a.time || "sem hora"}
            {showDate && a.time ? ` · ${a.time}` : ""}
          </p>
        </div>
        <p className="truncate text-sm text-muted">
          {a.serviceName || "Sem tipo"} · <span className="tabular-nums">{money(a.value)}</span>
        </p>
      </button>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <PayPill label={payText(a)} tone={a.payStatus} />
        {a.visitStatus ? <span className="text-xs text-muted">{VISIT_LABEL[a.visitStatus]}</span> : null}
        {a.payStatus !== "pago" && a.visitStatus !== "cancelado" ? (
          <button
            type="button"
            className="ml-auto h-11 rounded-lg bg-sunken px-3 text-sm font-medium"
            onClick={() => {
              markPaid(a.id);
              toast.success("Marcado como pago");
            }}
          >
            Recebi
          </button>
        ) : null}
      </div>
    </article>
  );
}

export function TodayView() {
  const appointments = useBook((s) => s.appointments);
  const clients = useBook((s) => s.clients);
  const settings = useBook((s) => s.settings);
  const dismissReminder = useBook((s) => s.dismissReminder);
  const { openAppt, openClient } = useStudio();
  const today = todayISO();
  const now = new Date();
  const monthAppts = appointments.filter((a) => inMonth(a.date, now.getFullYear(), now.getMonth()));
  const received = monthAppts
    .filter((a) => a.payStatus === "pago")
    .reduce((s, a) => s + (a.value ?? 0), 0);
  const open = monthAppts.filter(isOpenPayment).reduce((s, a) => s + (a.value ?? 0), 0);
  const todayList = appointments.filter((a) => a.date === today).sort(compareAppt);
  const reminders = dueReminders(appointments, today);
  const birthdays = upcomingBirthdays(clients, now, 10);
  const upcoming = appointments
    .filter((a) => a.date > today && a.visitStatus !== "cancelado")
    .sort(compareAppt)
    .slice(0, 5);

  return (
    <div className="grid gap-5">
      <div>
        <h1 className="font-display text-3xl text-fg">
          {greeting(now)}, {settings.practitioner || "Janice"}
        </h1>
        <p className="text-muted">{formatDay(today)} · caixa do mês</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Card className="p-3">
          <p className="text-xs text-muted">Hoje</p>
          <p className="font-display text-2xl tabular-nums">{todayList.length}</p>
        </Card>
        <Card className="p-3">
          <p className="text-xs text-muted">Recebido</p>
          <p className="font-display text-lg tabular-nums leading-tight">{money(received)}</p>
        </Card>
        <Card className="p-3">
          <p className="text-xs text-muted">A receber</p>
          <p className="font-display text-lg tabular-nums leading-tight">{money(open)}</p>
        </Card>
      </div>
      {reminders.length > 0 ? (
        <section className="grid gap-2">
          <h2 className="font-display text-xl">Lembretes de pagamento</h2>
          {reminders.map((a) => (
            <Card key={a.id} className="grid gap-2">
              <button type="button" className="text-left" onClick={() => openAppt(apptToDraft(a, clients))}>
                <p className="font-medium">{apptName(a, clients)}</p>
                <p className="text-sm text-muted">
                  {payText(a)}
                  {a.value != null ? ` · ${money(a.value)}` : ""}
                  {a.reminderNote ? ` · ${a.reminderNote}` : ""}
                </p>
              </button>
              <div className="flex gap-2">
                <Button
                  variant="primary"
                  onClick={() => {
                    useBook.getState().markPaid(a.id);
                    toast.success("Marcado como pago");
                  }}
                >
                  Recebi
                </Button>
                <Button variant="ghost" onClick={() => dismissReminder(a.id)}>
                  Dispensar
                </Button>
              </div>
            </Card>
          ))}
        </section>
      ) : null}
      {birthdays.length > 0 ? (
        <section className="grid gap-2">
          <h2 className="font-display text-xl">Aniversários</h2>
          {birthdays.map(({ client, inDays }) => (
            <button
              key={client.id}
              type="button"
              onClick={() => openClient(clientToDraft(client))}
              className="flex min-h-11 items-center justify-between rounded-xl border border-line bg-surface px-3 text-left"
            >
              <span>{client.name || "Sem nome"}</span>
              <span className="text-sm text-muted">{inDays === 0 ? "hoje" : `em ${inDays} dia${inDays > 1 ? "s" : ""}`}</span>
            </button>
          ))}
        </section>
      ) : null}
      <section className="grid gap-2">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl">Agenda de hoje</h2>
          <Button variant="ghost" onClick={() => openAppt(blankAppt({ date: today }))}>
            Marcar
          </Button>
        </div>
        {todayList.length === 0 ? (
          <Card>
            <p className="text-muted">Dia livre. Quando quiser, marque um horário — o nome já basta.</p>
          </Card>
        ) : (
          todayList.map((a) => <ApptCard key={a.id} a={a} />)
        )}
      </section>
      {upcoming.length > 0 ? (
        <section className="grid gap-2">
          <h2 className="font-display text-xl">Próximos</h2>
          {upcoming.map((a) => (
            <ApptCard key={a.id} a={a} showDate />
          ))}
        </section>
      ) : null}
    </div>
  );
}

export function AgendaView() {
  const appointments = useBook((s) => s.appointments);
  const clients = useBook((s) => s.clients);
  const { openAppt } = useStudio();
  const today = todayISO();
  const [selected, setSelected] = useState(today);
  const [mode, setMode] = useState<"dia" | "semana" | "mes">("dia");
  const [pay, setPay] = useState<"todos" | PayStatus>("todos");
  const [query, setQuery] = useState("");
  const now = new Date();
  const [cursor, setCursor] = useState({ year: now.getFullYear(), month: now.getMonth() });

  const matches = (a: Appointment) => {
    if (pay !== "todos" && a.payStatus !== pay) return false;
    if (!query.trim()) return true;
    const blob = norm(`${apptName(a, clients)} ${a.serviceName} ${a.notes}`);
    return blob.includes(norm(query));
  };

  const selectedDate = selected;
  const dayList = appointments.filter((a) => a.date === selectedDate && matches(a)).sort(compareAppt);
  const week = weekDays(selectedDate);
  const cells = monthCells(cursor.year, cursor.month);
  const undated = appointments.filter((a) => !a.date && matches(a));

  const goMonth = (delta: number) => {
    const next = shiftMonth(cursor.year, cursor.month, delta);
    setCursor(next);
    const day = selectedDate.slice(8, 10);
    const last = new Date(next.year, next.month + 1, 0).getDate();
    const safe = Math.min(Number(day) || 1, last);
    const iso = `${next.year}-${String(next.month + 1).padStart(2, "0")}-${String(safe).padStart(2, "0")}`;
    setSelected(iso);
  };

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap gap-2">
        {(["dia", "semana", "mes"] as const).map((item) => (
          <Choice key={item} on={mode === item} onClick={() => setMode(item)}>
            {item === "dia" ? "Dia" : item === "semana" ? "Semana" : "Mês"}
          </Choice>
        ))}
        {selected !== today ? (
          <Button
            variant="ghost"
            onClick={() => {
              setSelected(today);
              setCursor({ year: now.getFullYear(), month: now.getMonth() });
            }}
          >
            Hoje
          </Button>
        ) : null}
      </div>
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2">
        <IconButton aria-label="Mês anterior" onClick={() => goMonth(-1)}>
          <ChevronLeft className="size-5" />
        </IconButton>
        <p className="text-center font-display text-xl">{formatMonth(cursor.year, cursor.month)}</p>
        <IconButton aria-label="Próximo mês" onClick={() => goMonth(1)}>
          <ChevronRight className="size-5" />
        </IconButton>
      </div>
      {mode === "mes" ? (
        <div className="grid grid-cols-7 gap-1">
          {["2ª", "3ª", "4ª", "5ª", "6ª", "S", "D"].map((label) => (
            <div key={label} className="py-1 text-center text-xs text-muted">
              {label}
            </div>
          ))}
          {cells.map((cell, index) =>
            cell ? (
              <button
                key={cell.iso}
                type="button"
                onClick={() => setSelected(cell.iso)}
                className={
                  "flex h-11 flex-col items-center justify-center rounded-lg text-sm " +
                  (cell.iso === selected
                    ? "bg-accent text-accent-fg"
                    : cell.iso === today
                      ? "border border-accent bg-surface text-fg"
                      : "bg-surface text-fg")
                }
              >
                <span>{cell.day}</span>
                {appointments.some((a) => a.date === cell.iso) ? (
                  <span className="mt-0.5 size-1 rounded-full bg-current" />
                ) : null}
              </button>
            ) : (
              <span key={`e-${index}`} />
            ),
          )}
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-1">
          {week.map((iso) => {
            const day = Number(iso.slice(8, 10));
            return (
              <button
                key={iso}
                type="button"
                onClick={() => {
                  setSelected(iso);
                  const date = new Date(Number(iso.slice(0, 4)), Number(iso.slice(5, 7)) - 1, day);
                  setCursor({ year: date.getFullYear(), month: date.getMonth() });
                }}
                className={
                  "flex h-14 flex-col items-center justify-center rounded-lg text-sm " +
                  (iso === selected ? "bg-accent text-accent-fg" : "bg-surface text-fg")
                }
              >
                <span className="text-xs opacity-80">{["2ª", "3ª", "4ª", "5ª", "6ª", "S", "D"][(new Date(Number(iso.slice(0, 4)), Number(iso.slice(5, 7)) - 1, day).getDay() + 6) % 7]}</span>
                <span className="tabular-nums">{day}</span>
              </button>
            );
          })}
        </div>
      )}
      <TextInput value={query} placeholder="Buscar nome ou tipo" onChange={(e) => setQuery(e.target.value)} />
      <div className="flex min-w-0 gap-2 overflow-x-auto">
        {(
          [
            ["todos", "Todos"],
            ["pago", "Pagos"],
            ["pendente", "Pendentes"],
            ["nao_pago", "Não pagos"],
            ["combinado", "Vai pagar"],
          ] as const
        ).map(([id, label]) => (
          <Choice key={id} on={pay === id} onClick={() => setPay(id)}>
            {label}
          </Choice>
        ))}
      </div>
      {mode === "semana" ? (
        <div className="grid gap-4">
          {week.map((iso) => {
            const list = appointments.filter((a) => a.date === iso && matches(a)).sort(compareAppt);
            return (
              <section key={iso} className="grid gap-2">
                <h2 className="text-sm text-muted">{formatDay(iso)}</h2>
                {list.length === 0 ? (
                  <p className="text-sm text-muted">Nada marcado.</p>
                ) : (
                  list.map((a) => <ApptCard key={a.id} a={a} />)
                )}
              </section>
            );
          })}
        </div>
      ) : (
        <section className="grid gap-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl">{formatDay(selectedDate)}</h2>
            <Button variant="primary" onClick={() => openAppt(blankAppt({ date: selectedDate }))}>
              Marcar
            </Button>
          </div>
          {dayList.length === 0 ? (
            <Card>
              <p className="text-muted">Nenhum horário neste dia.</p>
            </Card>
          ) : (
            dayList.map((a) => <ApptCard key={a.id} a={a} />)
          )}
        </section>
      )}
      {undated.length > 0 ? (
        <section className="grid gap-2">
          <h2 className="font-display text-xl">Sem data</h2>
          {undated.map((a) => (
            <ApptCard key={a.id} a={a} />
          ))}
        </section>
      ) : null}
    </div>
  );
}

export function ClientsView() {
  const clients = useBook((s) => s.clients);
  const appointments = useBook((s) => s.appointments);
  const { openClient } = useStudio();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"todos" | "devendo" | "aniversario">("todos");
  const month = todayISO().slice(5, 7);

  const rows = clients
    .filter((c) => {
      const stats = statsFor(c.id, appointments);
      if (filter === "devendo" && stats.open <= 0) return false;
      if (filter === "aniversario" && c.birthday.slice(5, 7) !== month) return false;
      if (!query.trim()) return true;
      return norm(`${c.name} ${c.phone} ${c.email} ${c.notes}`).includes(norm(query));
    })
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-3xl">Contatos</h1>
        <Button variant="primary" onClick={() => openClient(blankClient())}>
          Novo
        </Button>
      </div>
      <TextInput value={query} placeholder="Buscar nome ou telefone" onChange={(e) => setQuery(e.target.value)} />
      <div className="flex flex-wrap gap-2">
        <Choice on={filter === "todos"} onClick={() => setFilter("todos")}>
          Todos
        </Choice>
        <Choice on={filter === "devendo"} onClick={() => setFilter("devendo")}>
          Em aberto
        </Choice>
        <Choice on={filter === "aniversario"} onClick={() => setFilter("aniversario")}>
          Aniversário do mês
        </Choice>
      </div>
      {rows.length === 0 ? (
        <Card>
          <p className="text-muted">Nenhum contato aqui. Você pode criar um agora ou importar a agenda em Mais.</p>
        </Card>
      ) : (
        <div className="grid gap-2">
          {rows.map((c) => {
            const stats = statsFor(c.id, appointments);
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => openClient(clientToDraft(c))}
                className="flex items-center gap-3 rounded-xl border border-line bg-surface p-3 text-left"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-sunken font-display text-accent">
                  {initials(c.name)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{c.name || "Sem nome"}</span>
                  <span className="block truncate text-sm text-muted">
                    marcou {stats.booked} · veio {stats.came}
                    {stats.lastCame ? ` · última ${formatShort(stats.lastCame)}` : " · ainda não veio"}
                  </span>
                </span>
                {stats.open > 0 ? (
                  <span className="shrink-0 text-sm tabular-nums text-accent">{money(stats.open)}</span>
                ) : null}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function FinanceView() {
  const appointments = useBook((s) => s.appointments);
  const clients = useBook((s) => s.clients);
  const { openAppt } = useStudio();
  const now = new Date();
  const [cursor, setCursor] = useState({ year: now.getFullYear(), month: now.getMonth() });
  const [perWeek, setPerWeek] = useState(8);
  const [ticket, setTicket] = useState(180);
  const [weeks, setWeeks] = useState(4);
  const [showRate, setShowRate] = useState(85);
  const [payRate, setPayRate] = useState(75);

  const monthAppts = appointments.filter(
    (a) => inMonth(a.date, cursor.year, cursor.month) && a.visitStatus !== "cancelado",
  );
  const received = monthAppts.filter((a) => a.payStatus === "pago").reduce((s, a) => s + (a.value ?? 0), 0);
  const pending = monthAppts.filter((a) => a.payStatus === "pendente").reduce((s, a) => s + (a.value ?? 0), 0);
  const promised = monthAppts.filter((a) => a.payStatus === "combinado").reduce((s, a) => s + (a.value ?? 0), 0);
  const unpaid = monthAppts.filter((a) => a.payStatus === "nao_pago").reduce((s, a) => s + (a.value ?? 0), 0);
  const undated = appointments
    .filter((a) => !a.date && a.visitStatus !== "cancelado" && a.payStatus !== "pago")
    .reduce((s, a) => s + (a.value ?? 0), 0);

  const chart = useMemo(() => {
    const last = new Date(cursor.year, cursor.month + 1, 0).getDate();
    const buckets = [];
    for (let i = 0; i * 7 + 1 <= last; i++) {
      const rows = monthAppts.filter((a) => weekIndex(a.date) === i);
      buckets.push({
        label: weekLabel(i),
        Recebido: rows.filter((a) => a.payStatus === "pago").reduce((s, a) => s + (a.value ?? 0), 0),
        Aberto: rows.filter((a) => a.payStatus !== "pago").reduce((s, a) => s + (a.value ?? 0), 0),
      });
    }
    return buckets;
  }, [cursor.month, cursor.year, monthAppts]);

  const byService = useMemo(() => {
    const map = new Map<string, number>();
    for (const a of monthAppts) {
      const key = a.serviceName.trim() || "Sem tipo";
      map.set(key, (map.get(key) ?? 0) + (a.value ?? 0));
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [monthAppts]);
  const maxService = Math.max(1, ...byService.map(([, value]) => value));

  const potential = perWeek * ticket * weeks;
  const afterShow = potential * (showRate / 100);
  const cash = afterShow * (payRate / 100);
  const plus20 = perWeek * weeks * (showRate / 100) * (payRate / 100) * 20;

  const applyPreset = (kind: "devagar" | "ritmo" | "cheio") => {
    if (kind === "devagar") {
      setPerWeek(4);
      setShowRate(70);
      setPayRate(60);
    } else if (kind === "cheio") {
      setPerWeek(12);
      setShowRate(95);
      setPayRate(90);
    } else {
      const count = monthAppts.length || 8;
      setPerWeek(Math.max(1, Math.round(count / 4)));
      const valued = monthAppts.filter((a) => a.value != null);
      const avg = valued.length ? valued.reduce((s, a) => s + (a.value ?? 0), 0) / valued.length : 180;
      setTicket(Math.round(avg));
      setShowRate(85);
      setPayRate(80);
    }
  };

  return (
    <div className="grid gap-5">
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2">
        <IconButton aria-label="Mês anterior" onClick={() => setCursor(shiftMonth(cursor.year, cursor.month, -1))}>
          <ChevronLeft className="size-5" />
        </IconButton>
        <h1 className="text-center font-display text-2xl">{formatMonth(cursor.year, cursor.month)}</h1>
        <IconButton aria-label="Próximo mês" onClick={() => setCursor(shiftMonth(cursor.year, cursor.month, 1))}>
          <ChevronRight className="size-5" />
        </IconButton>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Card className="p-3">
          <p className="text-xs text-muted">Recebido</p>
          <p className="font-display text-xl tabular-nums">{money(received)}</p>
        </Card>
        <Card className="p-3">
          <p className="text-xs text-muted">Pendente</p>
          <p className="font-display text-xl tabular-nums">{money(pending)}</p>
        </Card>
        <Card className="p-3">
          <p className="text-xs text-muted">Vai pagar</p>
          <p className="font-display text-xl tabular-nums">{money(promised)}</p>
        </Card>
        <Card className="p-3">
          <p className="text-xs text-muted">Não pago</p>
          <p className="font-display text-xl tabular-nums">{money(unpaid)}</p>
        </Card>
      </div>
      <Card className="grid gap-3">
        <h2 className="font-display text-xl">Como entrou no mês</h2>
        <div className="flex gap-4 text-xs text-muted">
          <span className="flex items-center gap-2">
            <i className="size-2 rounded-full bg-accent" /> Recebido
          </span>
          <span className="flex items-center gap-2">
            <i className="size-2 rounded-full bg-muted" /> Em aberto
          </span>
        </div>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chart}>
              <CartesianGrid vertical={false} stroke="var(--color-line)" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "var(--color-muted)", fontSize: 12 }} />
              <YAxis hide />
              <Tooltip
                cursor={{ fill: "var(--color-sunken)" }}
                formatter={(value) => money(typeof value === "number" ? value : Number(value ?? 0))}
                contentStyle={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-line)",
                  borderRadius: 12,
                  color: "var(--color-fg)",
                }}
              />
              <Bar dataKey="Recebido" fill="var(--color-accent)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Aberto" fill="var(--color-muted)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {byService.length === 0 ? (
          <p className="text-sm text-muted">Nenhum valor neste mês ainda.</p>
        ) : (
          <div className="grid gap-3">
            {byService.map(([name, value]) => (
              <div key={name}>
                <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
                  <span className="truncate">{name}</span>
                  <span className="tabular-nums">{money(value)}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-sunken">
                  <div className="h-full rounded-full bg-accent" style={{ width: `${Math.max(4, (value / maxService) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
        {undated > 0 ? <p className="text-sm text-muted">Há {money(undated)} em horários sem data, fora deste gráfico.</p> : null}
      </Card>
      <Card className="grid gap-4">
        <div>
          <h2 className="font-display text-xl">Simulador de cenário</h2>
          <p className="text-sm text-muted">Um chute honesto de caixa. Não mexe na agenda de verdade.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => applyPreset("devagar")}>Devagar</Button>
          <Button onClick={() => applyPreset("ritmo")}>No ritmo do mês</Button>
          <Button onClick={() => applyPreset("cheio")}>Agenda cheia</Button>
        </div>
        <Slider label="Atendimentos por semana" value={perWeek} min={0} max={30} onChange={setPerWeek} />
        <Slider label="Valor médio" value={ticket} min={0} max={1500} step={10} prefix="R$ " onChange={setTicket} />
        <Slider label="Semanas no mês" value={weeks} min={1} max={6} onChange={setWeeks} />
        <Slider label="Quem comparece" value={showRate} min={0} max={100} suffix="%" onChange={setShowRate} />
        <Slider label="Quem paga no mês" value={payRate} min={0} max={100} suffix="%" onChange={setPayRate} />
        <p className="text-sm text-muted">
          {perWeek} por semana × {money(ticket)} × {weeks} semanas, com {showRate}% de presença e {payRate}% recebidos no mês.
        </p>
        <div className="grid gap-2 sm:grid-cols-3">
          <Card className="bg-sunken p-3">
            <p className="text-xs text-muted">Se todos viessem e pagassem</p>
            <p className="font-display text-xl tabular-nums">{money(potential)}</p>
          </Card>
          <Card className="bg-sunken p-3">
            <p className="text-xs text-muted">Depois das faltas</p>
            <p className="font-display text-xl tabular-nums">{money(afterShow)}</p>
          </Card>
          <Card className="p-3">
            <p className="text-xs text-muted">Caixa estimado</p>
            <p className="font-display text-xl tabular-nums text-accent">{money(cash)}</p>
          </Card>
        </div>
        <p className="text-sm">
          Se cobrar {money(20)} a mais em cada atendimento, entram cerca de {money(plus20)} a mais no caixa.
          Neste mês você já recebeu {money(received)}.
        </p>
      </Card>
      <section className="grid gap-2">
        <h2 className="font-display text-xl">Movimentos</h2>
        {monthAppts.length === 0 ? (
          <p className="text-sm text-muted">Sem atendimentos neste mês.</p>
        ) : (
          [...monthAppts].sort(compareAppt).map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => openAppt(apptToDraft(a, clients))}
              className="flex min-h-11 items-center justify-between gap-3 rounded-xl border border-line bg-surface px-3 py-2 text-left"
            >
              <span className="min-w-0">
                <span className="block truncate font-medium">{apptName(a, clients)}</span>
                <span className="text-sm text-muted">
                  {formatShort(a.date)} · {PAY_LABEL[a.payStatus]}
                </span>
              </span>
              <span className="shrink-0 tabular-nums">{money(a.value)}</span>
            </button>
          ))
        )}
      </section>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  suffix = "",
  prefix = "",
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  prefix?: string;
  onChange: (n: number) => void;
}) {
  return (
    <label className="grid gap-1">
      <span className="flex items-baseline justify-between text-sm">
        <span>{label}</span>
        <span className="tabular-nums font-medium">
          {prefix}
          {value}
          {suffix}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="accent-accent h-11 w-full"
      />
    </label>
  );
}

export function MoreView() {
  const book = useBook();
  const fileRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<Book | null>(null);
  const [armedReset, setArmedReset] = useState(false);
  const hasDemo = book.clients.some((c) => c.demo) || book.appointments.some((a) => a.demo);

  const stamp = todayISO();

  const onFile = async (file: File) => {
    const text = await file.text();
    if (looksLikeBackup(text)) {
      const parsed = parseBackup(text);
      if (!parsed) {
        toast.error("Não reconheci esse backup");
        return;
      }
      setPending(parsed);
      return;
    }
    if (/BEGIN:VCARD/i.test(text)) {
      const rows = parseVcards(text);
      const result = book.importClients(rows);
      toast.success(`${result.added} contatos novos, ${result.skipped} já estavam na lista`);
      return;
    }
    const rows = parseContactsCsv(text);
    if (!rows.length) {
      toast.error("Não achei contatos nesse arquivo. Use vCard, CSV ou o backup.");
      return;
    }
    const result = book.importClients(rows);
    toast.success(`${result.added} contatos novos, ${result.skipped} já estavam na lista`);
  };

  return (
    <div className="grid gap-5">
      <div>
        <h1 className="font-display text-3xl">Mais</h1>
        <p className="text-muted">Tipos de atendimento, backup e o que fica no aparelho.</p>
      </div>
      <Card className="grid gap-3">
        <h2 className="font-display text-xl">Estúdio</h2>
        <Field label="Nome na capa">
          <TextInput
            value={book.settings.studioName}
            onChange={(e) => book.updateSettings({ studioName: e.target.value })}
          />
        </Field>
        <Field label="Como te chamar">
          <TextInput
            value={book.settings.practitioner}
            onChange={(e) => book.updateSettings({ practitioner: e.target.value })}
          />
        </Field>
        <Field label="Chave PIX" hint="entra no lembrete">
          <TextInput
            value={book.settings.pixKey}
            placeholder="celular, e-mail ou aleatória"
            onChange={(e) => book.updateSettings({ pixKey: e.target.value })}
          />
        </Field>
      </Card>
      <Card className="grid gap-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-xl">Tipos de atendimento</h2>
          <Button onClick={() => book.addService()}>Adicionar</Button>
        </div>
        <p className="text-sm text-muted">Consulta de tarot, limpeza, trabalho — ou o que você quiser. Pode apagar e criar.</p>
        {book.services.length === 0 ? <p className="text-sm text-muted">Nenhum tipo. O horário ainda aceita um nome livre.</p> : null}
        {book.services.map((service) => (
          <div key={service.id} className="grid gap-2 rounded-lg bg-sunken p-3">
            <TextInput
              value={service.name}
              aria-label="Nome do tipo"
              onChange={(e) => book.updateService(service.id, { name: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-2">
              <TextInput
                key={`${service.id}-${service.defaultPrice ?? "v"}`}
                inputMode="decimal"
                aria-label="Valor padrão"
                placeholder="Valor"
                defaultValue={service.defaultPrice ?? ""}
                onBlur={(e) => {
                  book.updateService(service.id, { defaultPrice: parseMoney(e.target.value) });
                }}
              />
              <TextInput
                key={`${service.id}-min-${service.durationMin ?? "m"}`}
                inputMode="numeric"
                aria-label="Duração em minutos"
                placeholder="Minutos"
                defaultValue={service.durationMin ?? ""}
                onBlur={(e) => {
                  const raw = e.target.value.trim();
                  const minutes = raw ? Number(raw) : null;
                  book.updateService(service.id, {
                    durationMin: minutes != null && !Number.isNaN(minutes) ? minutes : null,
                  });
                }}
              />
            </div>
            <Button variant="danger" onClick={() => book.removeService(service.id)}>
              Excluir tipo
            </Button>
          </div>
        ))}
      </Card>
      <Card className="grid gap-3">
        <h2 className="font-display text-xl">Levar e trazer</h2>
        <p className="text-sm text-muted">
          Tudo fica neste aparelho, neste navegador. Exporte um backup de vez em quando. Dá para importar contatos da agenda
          do celular (vCard ou CSV) e também o backup completo.
        </p>
        <Button
          onClick={() => downloadText(`janice-tarot-backup-${stamp}.json`, backupJson(book), "application/json")}
        >
          Exportar backup
        </Button>
        <Button onClick={() => downloadText(`contatos-${stamp}.csv`, clientsCsv(book), "text/csv")}>
          Exportar contatos
        </Button>
        <Button onClick={() => downloadText(`agenda-${stamp}.csv`, appointmentsCsv(book), "text/csv")}>
          Exportar agenda
        </Button>
        <Button onClick={() => fileRef.current?.click()}>Importar arquivo</Button>
        <input
          ref={fileRef}
          type="file"
          accept=".vcf,.vcard,.csv,.json,text/vcard,text/csv,application/json"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (file) void onFile(file);
          }}
        />
        {pending ? (
          <div className="grid gap-2 rounded-lg border border-line p-3">
            <p className="text-sm">
              Backup com {pending.clients.length} contatos e {pending.appointments.length} horários.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="primary"
                onClick={() => {
                  book.mergeBook(pending);
                  setPending(null);
                  toast.success("Backup juntado ao que já existe");
                }}
              >
                Juntar
              </Button>
              <Button
                onClick={() => {
                  book.replaceBook(pending);
                  setPending(null);
                  toast.success("Dados substituídos pelo backup");
                }}
              >
                Substituir tudo
              </Button>
              <Button variant="ghost" onClick={() => setPending(null)}>
                Cancelar
              </Button>
            </div>
          </div>
        ) : null}
      </Card>
      <Card className="grid gap-3">
        <h2 className="font-display text-xl">Limpar</h2>
        {hasDemo ? (
          <Button
            onClick={() => {
              book.clearDemo();
              toast.success("Exemplos apagados");
            }}
          >
            Apagar dados de exemplo
          </Button>
        ) : (
          <p className="text-sm text-muted">Não há dados de exemplo.</p>
        )}
        <Button
          variant="danger"
          onClick={() => {
            if (!armedReset) {
              setArmedReset(true);
              return;
            }
            book.resetAll();
            setArmedReset(false);
            toast.success("Agenda zerada");
          }}
        >
          {armedReset ? "Confirmar: apagar tudo" : "Zerar agenda e contatos"}
        </Button>
      </Card>
    </div>
  );
}
