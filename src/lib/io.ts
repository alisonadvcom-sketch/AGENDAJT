import type { Appointment, Book, Client, IncomingClient, PayStatus, ServiceType, Settings, VisitStatus } from "@/lib/book";
import { norm, parseMoney } from "@/lib/book";

const PAY: PayStatus[] = ["pago", "pendente", "nao_pago", "combinado"];
const VISIT: VisitStatus[] = ["", "agendado", "realizado", "faltou", "cancelado"];

function asString(v: unknown) {
  return typeof v === "string" ? v : "";
}

function asBool(v: unknown) {
  return v === true;
}

function asPay(v: unknown): PayStatus {
  return PAY.includes(v as PayStatus) ? (v as PayStatus) : "pendente";
}

function asVisit(v: unknown): VisitStatus {
  return VISIT.includes(v as VisitStatus) ? (v as VisitStatus) : "";
}

function asNumber(v: unknown): number | null {
  if (typeof v === "number" && !Number.isNaN(v)) return v;
  if (typeof v === "string") return parseMoney(v);
  return null;
}

function asClient(v: unknown): Client | null {
  if (!v || typeof v !== "object") return null;
  const o = v as Record<string, unknown>;
  const id = asString(o.id) || crypto.randomUUID();
  return {
    id,
    name: asString(o.name),
    phone: asString(o.phone),
    email: asString(o.email),
    notes: asString(o.notes),
    birthday: asString(o.birthday),
    source: asString(o.source),
    createdAt: asString(o.createdAt) || new Date().toISOString(),
    demo: asBool(o.demo),
  };
}

function asAppointment(v: unknown): Appointment | null {
  if (!v || typeof v !== "object") return null;
  const o = v as Record<string, unknown>;
  return {
    id: asString(o.id) || crypto.randomUUID(),
    clientId: asString(o.clientId) || null,
    guestName: asString(o.guestName),
    date: asString(o.date),
    time: asString(o.time),
    serviceId: asString(o.serviceId) || null,
    serviceName: asString(o.serviceName),
    value: asNumber(o.value),
    payStatus: asPay(o.payStatus),
    payDueDate: asString(o.payDueDate),
    reminderDate: asString(o.reminderDate),
    reminderNote: asString(o.reminderNote),
    reminderDone: asBool(o.reminderDone),
    visitStatus: asVisit(o.visitStatus),
    notes: asString(o.notes),
    createdAt: asString(o.createdAt) || new Date().toISOString(),
    paidAt: asString(o.paidAt),
    demo: asBool(o.demo),
  };
}

function asService(v: unknown): ServiceType | null {
  if (!v || typeof v !== "object") return null;
  const o = v as Record<string, unknown>;
  const name = asString(o.name).trim();
  if (!name) return null;
  return {
    id: asString(o.id) || crypto.randomUUID(),
    name,
    defaultPrice: asNumber(o.defaultPrice),
    durationMin: asNumber(o.durationMin),
  };
}

export function parseBackup(text: string): Book | null {
  try {
    const data = JSON.parse(text) as Record<string, unknown>;
    if (!data || typeof data !== "object") return null;
    const clients = Array.isArray(data.clients) ? data.clients.map(asClient).filter((x): x is Client => !!x) : null;
    const appointments = Array.isArray(data.appointments)
      ? data.appointments.map(asAppointment).filter((x): x is Appointment => !!x)
      : null;
    if (!clients || !appointments) return null;
    const services = Array.isArray(data.services)
      ? data.services.map(asService).filter((x): x is ServiceType => !!x)
      : [];
    const rawSettings = (data.settings ?? {}) as Partial<Settings>;
    const settings: Settings = {
      studioName: asString(rawSettings.studioName) || "Janice Tarot",
      practitioner: asString(rawSettings.practitioner) || "Janice",
      pixKey: asString(rawSettings.pixKey),
    };
    return { clients, appointments, services, settings };
  } catch {
    return null;
  }
}

export function parseVcards(text: string): IncomingClient[] {
  const chunks = text.split(/BEGIN:VCARD/i).slice(1);
  const rows: IncomingClient[] = [];
  for (const chunk of chunks) {
    const unfolded = chunk.replace(/\r\n[ \t]/g, "").replace(/\n[ \t]/g, "");
    let name = "";
    let phone = "";
    let email = "";
    let notes = "";
    let birthday = "";
    for (const line of unfolded.split(/\r?\n/)) {
      const idx = line.indexOf(":");
      if (idx <= 0) continue;
      const key = line.slice(0, idx).split(";")[0].trim().toUpperCase();
      const value = line
        .slice(idx + 1)
        .trim()
        .replace(/\\n/g, "\n")
        .replace(/\\,/g, ",");
      if (!value || value.toUpperCase() === "END") continue;
      if (key === "FN" && !name) name = value;
      else if (key === "TEL" && !phone) phone = value;
      else if (key === "EMAIL" && !email) email = value;
      else if (key === "NOTE" && !notes) notes = value;
      else if (key === "BDAY" && !birthday) birthday = normalizeBirthday(value);
    }
    if (!name && !phone && !email) continue;
    rows.push({ name, phone, email, notes, birthday, source: "Agenda" });
  }
  return rows;
}

function normalizeBirthday(value: string) {
  const iso = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;
  const md = value.match(/^--(\d{2})-(\d{2})/);
  if (md) return `1900-${md[1]}-${md[2]}`;
  return "";
}

function splitCsvLine(line: string, sep: string) {
  const out: string[] = [];
  let cur = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (quoted) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i += 1;
        } else quoted = false;
      } else cur += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === sep) {
      out.push(cur);
      cur = "";
    } else cur += ch;
  }
  out.push(cur);
  return out;
}

function findHeader(headers: string[], candidates: string[], mode: "exact" | "includes") {
  const normalized = headers.map((h) => norm(h));
  for (const candidate of candidates) {
    const target = norm(candidate);
    const index = normalized.findIndex((h) => (mode === "exact" ? h === target : h.includes(target)));
    if (index >= 0) return index;
  }
  return -1;
}

export function parseContactsCsv(text: string): IncomingClient[] {
  const clean = text.replace(/^\uFEFF/, "").trim();
  if (!clean) return [];
  const lines = clean.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];
  const semi = (lines[0].match(/;/g) ?? []).length;
  const comma = (lines[0].match(/,/g) ?? []).length;
  const sep = semi > comma ? ";" : ",";
  const headers = splitCsvLine(lines[0], sep).map((h) => h.trim());
  const nameI = findHeader(headers, ["nome", "name", "full name", "nome completo"], "exact");
  const givenI = findHeader(headers, ["given name", "primeiro nome", "first name"], "includes");
  const familyI = findHeader(headers, ["family name", "sobrenome", "last name"], "includes");
  const phoneI = findHeader(headers, ["telefone", "celular", "phone", "mobile", "whatsapp"], "includes");
  const emailI = findHeader(headers, ["e-mail", "email"], "includes");
  const noteI = findHeader(headers, ["observacao", "observacoes", "notas", "notes", "note"], "includes");
  const bdayI = findHeader(headers, ["aniversario", "birthday", "birth"], "includes");
  const rows: IncomingClient[] = [];
  for (const line of lines.slice(1)) {
    const cols = splitCsvLine(line, sep);
    const at = (i: number) => (i >= 0 ? (cols[i] ?? "").trim() : "");
    let name = at(nameI);
    if (!name) name = [at(givenI), at(familyI)].filter(Boolean).join(" ");
    const phone = at(phoneI);
    const email = at(emailI);
    if (!name && !phone && !email) continue;
    rows.push({
      name,
      phone,
      email,
      notes: at(noteI),
      birthday: normalizeBirthday(at(bdayI)),
      source: "Agenda",
    });
  }
  return rows;
}

export function looksLikeBackup(text: string) {
  const t = text.trim();
  if (!t.startsWith("{")) return false;
  return t.includes('"clients"') || t.includes('"appointments"');
}
