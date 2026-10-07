import { create } from "zustand";

export type PayStatus = "pago" | "pendente" | "nao_pago" | "combinado";
export type VisitStatus = "" | "agendado" | "realizado" | "faltou" | "cancelado";

export type ServiceType = {
  id: string;
  name: string;
  defaultPrice: number | null;
  durationMin: number | null;
};

export type Client = {
  id: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
  birthday: string;
  source: string;
  createdAt: string;
  demo?: boolean;
};

export type Appointment = {
  id: string;
  clientId: string | null;
  guestName: string;
  date: string;
  time: string;
  serviceId: string | null;
  serviceName: string;
  value: number | null;
  payStatus: PayStatus;
  payDueDate: string;
  reminderDate: string;
  reminderNote: string;
  reminderDone: boolean;
  visitStatus: VisitStatus;
  notes: string;
  createdAt: string;
  paidAt: string;
  demo?: boolean;
};

export type Settings = {
  studioName: string;
  practitioner: string;
  pixKey: string;
};

export type Book = {
  clients: Client[];
  appointments: Appointment[];
  services: ServiceType[];
  settings: Settings;
};

export type ClientDraft = {
  id?: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
  birthday: string;
  source: string;
};

export type ApptDraft = {
  id?: string;
  clientId: string;
  guestName: string;
  phone: string;
  date: string;
  time: string;
  serviceId: string;
  serviceName: string;
  value: string;
  payStatus: PayStatus;
  payDueDate: string;
  reminderDate: string;
  reminderNote: string;
  visitStatus: VisitStatus;
  notes: string;
  saveContact: boolean;
};

export const PAY_LABEL: Record<PayStatus, string> = {
  pago: "Pago",
  pendente: "Pendente",
  nao_pago: "Não pago",
  combinado: "Vai pagar",
};

export const VISIT_LABEL: Record<VisitStatus, string> = {
  "": "Sem status",
  agendado: "Agendado",
  realizado: "Veio",
  faltou: "Faltou",
  cancelado: "Cancelado",
};

const STORAGE_KEY = "janice-tarot-book-v1";

const defaultSettings = (): Settings => ({
  studioName: "Janice Tarot",
  practitioner: "Janice",
  pixKey: "",
});

const TZ = "America/Sao_Paulo";

export function todayISO(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function addDays(n: number, base = new Date()) {
  const [y, m, d] = todayISO(base).split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + n));
  const yy = dt.getUTCFullYear();
  const mm = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(dt.getUTCDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

export function parseISODate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function sentence(value: string) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : value;
}

export function formatDay(iso: string) {
  const date = parseISODate(iso);
  if (!date) return "Sem data";
  const label = new Intl.DateTimeFormat("pt-BR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(date);
  return sentence(label);
}

export function formatShort(iso: string) {
  const date = parseISODate(iso);
  if (!date) return "";
  return new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "short" }).format(date);
}

export function formatMonth(year: number, month: number) {
  const label = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(
    new Date(year, month, 1),
  );
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function money(n: number | null | undefined) {
  if (n == null || Number.isNaN(n)) return "—";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);
}

export function moneyInput(n: number | null) {
  if (n == null) return "";
  return n.toLocaleString("pt-BR", { maximumFractionDigits: 2 });
}

export function parseMoney(input: string): number | null {
  const t = input.trim();
  if (!t) return null;
  let s = t.replace(/[^\d,.-]/g, "");
  if (!s) return null;
  if (s.includes(",")) s = s.replace(/\./g, "").replace(",", ".");
  const n = Number(s);
  return Number.isNaN(n) ? null : n;
}

export function norm(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();
}

export function digits(s: string) {
  return s.replace(/\D/g, "");
}

export function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function greeting(now = new Date()) {
  const h = Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: TZ,
      hour: "numeric",
      hourCycle: "h23",
    }).format(now),
  );
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

export function apptName(a: Appointment, clients: Client[]) {
  if (a.clientId) {
    const c = clients.find((x) => x.id === a.clientId);
    if (c?.name.trim()) return c.name.trim();
  }
  return a.guestName.trim() || "Sem nome";
}

export function clientById(clients: Client[], id: string | null) {
  if (!id) return undefined;
  return clients.find((c) => c.id === id);
}

export type ClientStats = {
  booked: number;
  came: number;
  missed: number;
  charged: number;
  received: number;
  open: number;
  lastCame: string;
  lastBooked: string;
  history: Appointment[];
};

export function statsFor(clientId: string, appointments: Appointment[]): ClientStats {
  const list = appointments.filter((a) => a.clientId === clientId);
  const notCancelled = list.filter((a) => a.visitStatus !== "cancelado");
  const came = list.filter((a) => a.visitStatus === "realizado");
  const missed = list.filter((a) => a.visitStatus === "faltou");
  const sum = (rows: Appointment[], pred: (a: Appointment) => boolean) =>
    rows.filter(pred).reduce((s, a) => s + (a.value ?? 0), 0);
  const dates = (rows: Appointment[]) =>
    rows
      .map((a) => a.date)
      .filter(Boolean)
      .sort();
  return {
    booked: list.length,
    came: came.length,
    missed: missed.length,
    charged: sum(notCancelled, () => true),
    received: sum(list, (a) => a.payStatus === "pago"),
    open: sum(notCancelled, (a) => a.payStatus !== "pago"),
    lastCame: dates(came).at(-1) ?? "",
    lastBooked: dates(notCancelled).at(-1) ?? "",
    history: [...list].sort(compareApptDesc),
  };
}

export function compareAppt(a: Appointment, b: Appointment) {
  const da = a.date || "9999-99-99";
  const db = b.date || "9999-99-99";
  if (da !== db) return da < db ? -1 : 1;
  const ta = a.time || "99:99";
  const tb = b.time || "99:99";
  if (ta !== tb) return ta < tb ? -1 : 1;
  return a.createdAt.localeCompare(b.createdAt);
}

export function compareApptDesc(a: Appointment, b: Appointment) {
  return compareAppt(b, a);
}

export function isOpenPayment(a: Appointment) {
  return a.payStatus !== "pago" && a.visitStatus !== "cancelado";
}

export function dueReminders(appointments: Appointment[], today: string) {
  return appointments
    .filter((a) => {
      if (a.payStatus === "pago" || a.visitStatus === "cancelado" || a.reminderDone) return false;
      if (a.reminderDate && a.reminderDate <= today) return true;
      if (a.payStatus === "combinado" && a.payDueDate && a.payDueDate <= today) return true;
      return false;
    })
    .sort(compareAppt);
}

export function upcomingBirthdays(clients: Client[], today = new Date(), within = 14) {
  const start = parseISODate(todayISO(today));
  if (!start) return [];
  const hits: { client: Client; when: string; inDays: number }[] = [];
  for (const client of clients) {
    if (!client.birthday) continue;
    const parsed = parseISODate(client.birthday);
    if (!parsed) continue;
    let when = new Date(start.getFullYear(), parsed.getMonth(), parsed.getDate());
    if (when < start) when = new Date(start.getFullYear() + 1, parsed.getMonth(), parsed.getDate());
    const inDays = Math.round((when.getTime() - start.getTime()) / 86400000);
    if (inDays >= 0 && inDays <= within) {
      const mm = String(when.getMonth() + 1).padStart(2, "0");
      const dd = String(when.getDate()).padStart(2, "0");
      hits.push({ client, when: `${when.getFullYear()}-${mm}-${dd}`, inDays });
    }
  }
  return hits.sort((a, b) => a.inDays - b.inDays);
}

export function monthKey(iso: string) {
  return iso.slice(0, 7);
}

export function inMonth(iso: string, year: number, month: number) {
  if (!iso) return false;
  const [y, m] = iso.split("-").map(Number);
  return y === year && m === month + 1;
}

export function weekIndex(iso: string) {
  const date = parseISODate(iso);
  if (!date) return 0;
  return Math.floor((date.getDate() - 1) / 7);
}

export function weekLabel(index: number) {
  return `Sem ${index + 1}`;
}

export function shiftMonth(year: number, month: number, delta: number) {
  const d = new Date(year, month + delta, 1);
  return { year: d.getFullYear(), month: d.getMonth() };
}

export function startOfWeek(iso: string) {
  const date = parseISODate(iso) ?? new Date();
  const pad = (date.getDay() + 6) % 7;
  date.setDate(date.getDate() - pad);
  return todayISO(date);
}

export function weekDays(iso: string) {
  const start = parseISODate(startOfWeek(iso)) ?? new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
    return todayISO(d);
  });
}

export function monthCells(year: number, month: number) {
  const first = new Date(year, month, 1);
  const pad = (first.getDay() + 6) % 7;
  const count = new Date(year, month + 1, 0).getDate();
  const cells: Array<{ iso: string; day: number } | null> = [];
  for (let i = 0; i < pad; i++) cells.push(null);
  for (let day = 1; day <= count; day++) {
    const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    cells.push({ iso, day });
  }
  return cells;
}

export function waLink(phone: string, text: string) {
  let n = digits(phone);
  if (!n) return null;
  if (n.length <= 11) n = `55${n}`;
  return `https://wa.me/${n}?text=${encodeURIComponent(text)}`;
}

export function chargeMessage(opts: {
  name: string;
  serviceName: string;
  value: number | null;
  date: string;
  payDueDate: string;
  pixKey: string;
}) {
  const first = opts.name.trim().split(/\s+/)[0];
  const bits = [`Oi${first ? ` ${first}` : ""}, tudo bem?`];
  const about = [
    "Passando para lembrar do pagamento",
    opts.serviceName ? `de ${opts.serviceName.toLowerCase()}` : "",
    opts.value != null ? `no valor de ${money(opts.value)}` : "",
    opts.date ? `do dia ${formatShort(opts.date)}` : "",
  ]
    .filter(Boolean)
    .join(" ");
  bits.push(`${about}.`);
  if (opts.payDueDate) bits.push(`Ficou combinado para ${formatShort(opts.payDueDate)}.`);
  if (opts.pixKey.trim()) bits.push(`PIX: ${opts.pixKey.trim()}`);
  bits.push("Obrigada.");
  return bits.join(" ");
}

export function blankClient(): ClientDraft {
  return { name: "", phone: "", email: "", notes: "", birthday: "", source: "" };
}

export function clientToDraft(c: Client): ClientDraft {
  return {
    id: c.id,
    name: c.name,
    phone: c.phone,
    email: c.email,
    notes: c.notes,
    birthday: c.birthday,
    source: c.source,
  };
}

export function blankAppt(prefill: Partial<ApptDraft> = {}): ApptDraft {
  return {
    clientId: "",
    guestName: "",
    phone: "",
    date: "",
    time: "",
    serviceId: "",
    serviceName: "",
    value: "",
    payStatus: "pendente",
    payDueDate: "",
    reminderDate: "",
    reminderNote: "",
    visitStatus: "agendado",
    notes: "",
    saveContact: true,
    ...prefill,
  };
}

export function apptToDraft(a: Appointment, clients: Client[]): ApptDraft {
  const client = clientById(clients, a.clientId);
  return {
    id: a.id,
    clientId: a.clientId ?? "",
    guestName: apptName(a, clients) === "Sem nome" ? "" : apptName(a, clients),
    phone: client?.phone ?? "",
    date: a.date,
    time: a.time,
    serviceId: a.serviceId ?? "",
    serviceName: a.serviceName,
    value: moneyInput(a.value),
    payStatus: a.payStatus,
    payDueDate: a.payDueDate,
    reminderDate: a.reminderDate,
    reminderNote: a.reminderNote,
    visitStatus: a.visitStatus,
    notes: a.notes,
    saveContact: false,
  };
}

function defaultServices(): ServiceType[] {
  return [
    { id: "svc-tarot", name: "Consulta de tarot", defaultPrice: 150, durationMin: 50 },
    { id: "svc-limpeza", name: "Limpeza espiritual", defaultPrice: 220, durationMin: 80 },
    { id: "svc-trabalho", name: "Trabalho espiritual", defaultPrice: 480, durationMin: null },
  ];
}

function seedBook(): Book {
  const stamp = `${todayISO()}T12:00:00.000Z`;
  const clients: Client[] = [
    {
      id: "cli-marina",
      name: "Marina Alves",
      phone: "(19) 98821-1044",
      email: "marina.alves@email.com",
      notes: "Prefere pergunta objetiva. Veio por indicação da irmã.",
      birthday: birthdayNear(2, 1991),
      source: "Indicação",
      createdAt: stamp,
      demo: true,
    },
    {
      id: "cli-camila",
      name: "Camila Rocha",
      phone: "(19) 99710-2208",
      email: "",
      notes: "Sensível a horário. Confirmar na véspera.",
      birthday: "",
      source: "Instagram",
      createdAt: stamp,
      demo: true,
    },
    {
      id: "cli-helena",
      name: "Helena Duarte",
      phone: "(11) 98102-4471",
      email: "helena.duarte@email.com",
      notes: "",
      birthday: "",
      source: "Indicação",
      createdAt: stamp,
      demo: true,
    },
    {
      id: "cli-patricia",
      name: "Patrícia Nunes",
      phone: "(19) 99233-0186",
      email: "",
      notes: "Pediu para pagar depois do quinto dia útil.",
      birthday: "",
      source: "WhatsApp",
      createdAt: stamp,
      demo: true,
    },
    {
      id: "cli-juliana",
      name: "Juliana Ferraz",
      phone: "(19) 99640-7730",
      email: "",
      notes: "",
      birthday: "",
      source: "Cliente antiga",
      createdAt: stamp,
      demo: true,
    },
    {
      id: "cli-lucas",
      name: "Lucas Mendes",
      phone: "(19) 99155-6621",
      email: "",
      notes: "Pediu retorno. Ainda não marcou.",
      birthday: "",
      source: "Indicação",
      createdAt: stamp,
      demo: true,
    },
  ];

  const A = (
    partial: Pick<Appointment, "id" | "clientId" | "guestName" | "date" | "serviceId" | "serviceName" | "value" | "payStatus"> &
      Partial<Appointment>,
  ): Appointment => ({
    time: "",
    payDueDate: "",
    reminderDate: "",
    reminderNote: "",
    reminderDone: false,
    visitStatus: "agendado",
    notes: "",
    createdAt: stamp,
    paidAt: partial.payStatus === "pago" ? partial.date : "",
    demo: true,
    ...partial,
  });

  const appointments: Appointment[] = [
    A({
      id: "apt-1",
      clientId: "cli-marina",
      guestName: "Marina Alves",
      date: addDays(0),
      time: "10:00",
      serviceId: "svc-tarot",
      serviceName: "Consulta de tarot",
      value: 150,
      payStatus: "pago",
      visitStatus: "agendado",
      notes: "Pergunta sobre trabalho.",
    }),
    A({
      id: "apt-2",
      clientId: "cli-camila",
      guestName: "Camila Rocha",
      date: addDays(0),
      time: "16:30",
      serviceId: "svc-limpeza",
      serviceName: "Limpeza espiritual",
      value: 220,
      payStatus: "pendente",
      visitStatus: "agendado",
      reminderDate: addDays(0),
      reminderNote: "Cobrar no fim do atendimento.",
    }),
    A({
      id: "apt-3",
      clientId: "cli-helena",
      guestName: "Helena Duarte",
      date: addDays(1),
      time: "19:00",
      serviceId: "svc-trabalho",
      serviceName: "Trabalho espiritual",
      value: 480,
      payStatus: "combinado",
      payDueDate: addDays(6),
      visitStatus: "agendado",
    }),
    A({
      id: "apt-4",
      clientId: "cli-patricia",
      guestName: "Patrícia Nunes",
      date: addDays(-10),
      time: "14:00",
      serviceId: "svc-tarot",
      serviceName: "Consulta de tarot",
      value: 150,
      payStatus: "combinado",
      payDueDate: addDays(-1),
      reminderDate: addDays(0),
      visitStatus: "realizado",
      notes: "Combinou pagar ontem.",
    }),
    A({
      id: "apt-5",
      clientId: "cli-juliana",
      guestName: "Juliana Ferraz",
      date: addDays(-6),
      time: "11:00",
      serviceId: "svc-tarot",
      serviceName: "Consulta de tarot",
      value: 150,
      payStatus: "pago",
      visitStatus: "realizado",
    }),
    A({
      id: "apt-6",
      clientId: "cli-juliana",
      guestName: "Juliana Ferraz",
      date: addDays(-28),
      time: "11:00",
      serviceId: "svc-limpeza",
      serviceName: "Limpeza espiritual",
      value: 220,
      payStatus: "pago",
      visitStatus: "realizado",
    }),
    A({
      id: "apt-7",
      clientId: "cli-marina",
      guestName: "Marina Alves",
      date: addDays(8),
      time: "10:00",
      serviceId: "svc-tarot",
      serviceName: "Consulta de tarot",
      value: 150,
      payStatus: "pendente",
      visitStatus: "agendado",
    }),
    A({
      id: "apt-8",
      clientId: "cli-camila",
      guestName: "Camila Rocha",
      date: addDays(-18),
      time: "15:00",
      serviceId: "svc-tarot",
      serviceName: "Consulta de tarot",
      value: 150,
      payStatus: "nao_pago",
      visitStatus: "faltou",
      notes: "Avisou em cima da hora.",
    }),
    A({
      id: "apt-9",
      clientId: "cli-helena",
      guestName: "Helena Duarte",
      date: addDays(-3),
      time: "18:30",
      serviceId: "svc-tarot",
      serviceName: "Consulta de tarot",
      value: 150,
      payStatus: "pago",
      visitStatus: "realizado",
    }),
  ];

  return {
    clients,
    appointments,
    services: defaultServices(),
    settings: defaultSettings(),
  };
}

function birthdayNear(offsetDays: number, year: number) {
  const iso = addDays(offsetDays);
  const [, m, d] = iso.split("-");
  return `${year}-${m}-${d}`;
}

function snapshot(s: Book): Book {
  return {
    clients: s.clients,
    appointments: s.appointments,
    services: s.services,
    settings: s.settings,
  };
}

function persistBook(book: Book) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(book));
}

function readStored(): Book | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Book>;
    if (!Array.isArray(parsed.clients) || !Array.isArray(parsed.appointments)) return null;
    return {
      clients: parsed.clients,
      appointments: parsed.appointments,
      services: Array.isArray(parsed.services) && parsed.services.length ? parsed.services : defaultServices(),
      settings: { ...defaultSettings(), ...(parsed.settings ?? {}) },
    };
  } catch {
    return null;
  }
}

export type IncomingClient = {
  name: string;
  phone: string;
  email: string;
  notes: string;
  birthday: string;
  source: string;
};

type BookState = Book & {
  saveClient: (draft: ClientDraft) => string;
  removeClient: (id: string) => void;
  saveAppointment: (draft: ApptDraft) => void;
  removeAppointment: (id: string) => void;
  markPaid: (id: string) => void;
  dismissReminder: (id: string) => void;
  addService: () => void;
  updateService: (id: string, patch: Partial<ServiceType>) => void;
  removeService: (id: string) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  importClients: (rows: IncomingClient[]) => { added: number; skipped: number };
  mergeBook: (book: Book) => void;
  replaceBook: (book: Book) => void;
  clearDemo: () => void;
  resetAll: () => void;
  adoptStorage: () => void;
};

export const useBook = create<BookState>((set, get) => {
  const commit = (partial: Partial<Book>) => {
    const next = { ...snapshot(get()), ...partial };
    persistBook(next);
    set(next);
  };

  return {
    ...seedBook(),

    adoptStorage: () => {
      const stored = readStored();
      if (stored) {
        set(stored);
        return;
      }
      persistBook(snapshot(get()));
    },

    saveClient: (draft) => {
      const name = draft.name.trim();
      const row: Client = {
        id: draft.id || crypto.randomUUID(),
        name,
        phone: draft.phone.trim(),
        email: draft.email.trim(),
        notes: draft.notes.trim(),
        birthday: draft.birthday,
        source: draft.source.trim(),
        createdAt: get().clients.find((c) => c.id === draft.id)?.createdAt || new Date().toISOString(),
        demo: get().clients.find((c) => c.id === draft.id)?.demo,
      };
      const exists = get().clients.some((c) => c.id === row.id);
      commit({
        clients: exists ? get().clients.map((c) => (c.id === row.id ? row : c)) : [row, ...get().clients],
      });
      return row.id;
    },

    removeClient: (id) => {
      const client = get().clients.find((c) => c.id === id);
      commit({
        clients: get().clients.filter((c) => c.id !== id),
        appointments: get().appointments.map((a) =>
          a.clientId === id ? { ...a, clientId: null, guestName: a.guestName || client?.name || "" } : a,
        ),
      });
    },

    saveAppointment: (draft) => {
      let clients = get().clients;
      let clientId = draft.clientId || null;
      const guestName = draft.guestName.trim();
      if (clientId && !clients.some((c) => c.id === clientId)) clientId = null;
      if (!clientId && guestName) {
        const match = clients.find((c) => norm(c.name) === norm(guestName));
        if (match) clientId = match.id;
        else if (draft.saveContact) {
          const created: Client = {
            id: crypto.randomUUID(),
            name: guestName,
            phone: draft.phone.trim(),
            email: "",
            notes: "",
            birthday: "",
            source: "",
            createdAt: new Date().toISOString(),
          };
          clients = [created, ...clients];
          clientId = created.id;
        }
      }
      if (clientId && draft.phone.trim()) {
        const phone = draft.phone.trim();
        clients = clients.map((c) => (c.id === clientId && c.phone !== phone ? { ...c, phone } : c));
      }
      const prev = draft.id ? get().appointments.find((a) => a.id === draft.id) : undefined;
      const sameReminder = prev && prev.reminderDate === draft.reminderDate;
      const appt: Appointment = {
        id: draft.id || crypto.randomUUID(),
        clientId,
        guestName,
        date: draft.date,
        time: draft.time,
        serviceId: draft.serviceId || null,
        serviceName: draft.serviceName.trim(),
        value: parseMoney(draft.value),
        payStatus: draft.payStatus,
        payDueDate: draft.payDueDate,
        reminderDate: draft.reminderDate,
        reminderNote: draft.reminderNote.trim(),
        reminderDone: Boolean(sameReminder && prev?.reminderDone),
        visitStatus: draft.visitStatus,
        notes: draft.notes.trim(),
        createdAt: prev?.createdAt || new Date().toISOString(),
        paidAt: draft.payStatus === "pago" ? prev?.paidAt || todayISO() : "",
        demo: prev?.demo,
      };
      commit({
        clients,
        appointments: prev
          ? get().appointments.map((a) => (a.id === appt.id ? appt : a))
          : [appt, ...get().appointments],
      });
    },

    removeAppointment: (id) => {
      commit({ appointments: get().appointments.filter((a) => a.id !== id) });
    },

    markPaid: (id) => {
      commit({
        appointments: get().appointments.map((a) =>
          a.id === id ? { ...a, payStatus: "pago", paidAt: a.paidAt || todayISO(), reminderDone: true } : a,
        ),
      });
    },

    dismissReminder: (id) => {
      commit({
        appointments: get().appointments.map((a) => (a.id === id ? { ...a, reminderDone: true } : a)),
      });
    },

    addService: () => {
      const row: ServiceType = {
        id: crypto.randomUUID(),
        name: "Novo atendimento",
        defaultPrice: null,
        durationMin: null,
      };
      commit({ services: [...get().services, row] });
    },

    updateService: (id, patch) => {
      commit({
        services: get().services.map((s) => (s.id === id ? { ...s, ...patch } : s)),
      });
    },

    removeService: (id) => {
      commit({ services: get().services.filter((s) => s.id !== id) });
    },

    updateSettings: (patch) => {
      commit({ settings: { ...get().settings, ...patch } });
    },

    importClients: (rows) => {
      const clients = [...get().clients];
      let added = 0;
      let skipped = 0;
      for (const row of rows) {
        const name = row.name.trim();
        const phone = row.phone.trim();
        const email = row.email.trim();
        if (!name && !phone && !email) {
          skipped += 1;
          continue;
        }
        const phoneKey = digits(phone);
        const dup = clients.some((c) => {
          if (phoneKey && digits(c.phone) === phoneKey) return true;
          if (name && norm(c.name) === norm(name) && (!phoneKey || digits(c.phone) === phoneKey)) return true;
          return false;
        });
        if (dup) {
          skipped += 1;
          continue;
        }
        clients.push({
          id: crypto.randomUUID(),
          name,
          phone,
          email,
          notes: row.notes.trim(),
          birthday: row.birthday,
          source: row.source.trim() || "Agenda",
          createdAt: new Date().toISOString(),
        });
        added += 1;
      }
      commit({ clients });
      return { added, skipped };
    },

    mergeBook: (book) => {
      const clients = [...get().clients];
      const appointments = [...get().appointments];
      const services = [...get().services];
      for (const c of book.clients) if (!clients.some((x) => x.id === c.id)) clients.push(c);
      for (const a of book.appointments) if (!appointments.some((x) => x.id === a.id)) appointments.push(a);
      for (const s of book.services) if (!services.some((x) => x.id === s.id)) services.push(s);
      commit({ clients, appointments, services, settings: { ...get().settings, ...book.settings } });
    },

    replaceBook: (book) => {
      commit({
        clients: book.clients,
        appointments: book.appointments,
        services: book.services.length ? book.services : defaultServices(),
        settings: { ...defaultSettings(), ...book.settings },
      });
    },

    clearDemo: () => {
      commit({
        clients: get().clients.filter((c) => !c.demo),
        appointments: get().appointments.filter((a) => !a.demo),
      });
    },

    resetAll: () => {
      commit({
        clients: [],
        appointments: [],
        services: defaultServices(),
        settings: defaultSettings(),
      });
    },
  };
});

export function downloadText(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function toCsv(rows: string[][]) {
  const esc = (cell: string) => {
    if (/[;"\n]/.test(cell)) return `"${cell.replace(/"/g, '""')}"`;
    return cell;
  };
  return `\uFEFF${rows.map((r) => r.map(esc).join(";")).join("\n")}`;
}

export function clientsCsv(book: Book) {
  const header = [
    "nome",
    "telefone",
    "email",
    "aniversario",
    "origem",
    "observacoes",
    "vezes_marcou",
    "vezes_foi",
    "ultima_vez",
    "valor_cobrado",
    "valor_recebido",
    "em_aberto",
  ];
  const lines = book.clients
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"))
    .map((c) => {
      const s = statsFor(c.id, book.appointments);
      return [
        c.name,
        c.phone,
        c.email,
        c.birthday,
        c.source,
        c.notes,
        String(s.booked),
        String(s.came),
        s.lastCame,
        s.charged ? String(s.charged).replace(".", ",") : "",
        s.received ? String(s.received).replace(".", ",") : "",
        s.open ? String(s.open).replace(".", ",") : "",
      ];
    });
  return toCsv([header, ...lines]);
}

export function appointmentsCsv(book: Book) {
  const header = [
    "data",
    "hora",
    "nome",
    "telefone",
    "tipo",
    "valor",
    "pagamento",
    "vai_pagar_em",
    "lembrete",
    "comparecimento",
    "observacoes",
  ];
  const lines = book.appointments.slice().sort(compareAppt).map((a) => {
    const client = clientById(book.clients, a.clientId);
    return [
      a.date,
      a.time,
      apptName(a, book.clients),
      client?.phone ?? "",
      a.serviceName,
      a.value != null ? String(a.value).replace(".", ",") : "",
      PAY_LABEL[a.payStatus],
      a.payDueDate,
      a.reminderDate,
      VISIT_LABEL[a.visitStatus],
      a.notes,
    ];
  });
  return toCsv([header, ...lines]);
}

export function backupJson(book: Book) {
  return JSON.stringify(
    {
      app: "janice-tarot",
      version: 1,
      exportedAt: new Date().toISOString(),
      ...snapshot(book),
    },
    null,
    2,
  );
}
