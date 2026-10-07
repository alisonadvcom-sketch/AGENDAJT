import { i as __toESM } from "../_runtime.mjs";
import { d as require_react_dom, q as require_react, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as SlidersHorizontal, c as ChevronRight, l as ChevronLeft, n as Wallet, o as Plus, r as Users, s as House, t as X, u as CalendarDays } from "../_libs/lucide-react.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { a as Bar, i as CartesianGrid, n as YAxis, o as ResponsiveContainer, r as XAxis, s as Tooltip, t as BarChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes--7JO4amH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_react_dom = /* @__PURE__ */ __toESM(require_react_dom());
var PAY_LABEL = {
	pago: "Pago",
	pendente: "Pendente",
	nao_pago: "Não pago",
	combinado: "Vai pagar"
};
var VISIT_LABEL = {
	"": "Sem status",
	agendado: "Agendado",
	realizado: "Veio",
	faltou: "Faltou",
	cancelado: "Cancelado"
};
var STORAGE_KEY = "janice-tarot-book-v1";
var defaultSettings = () => ({
	studioName: "Janice Tarot",
	practitioner: "Janice",
	pixKey: ""
});
var TZ = "America/Sao_Paulo";
function todayISO(now = /* @__PURE__ */ new Date()) {
	return new Intl.DateTimeFormat("en-CA", {
		timeZone: TZ,
		year: "numeric",
		month: "2-digit",
		day: "2-digit"
	}).format(now);
}
function addDays(n, base = /* @__PURE__ */ new Date()) {
	const [y, m, d] = todayISO(base).split("-").map(Number);
	const dt = new Date(Date.UTC(y, m - 1, d + n));
	return `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, "0")}-${String(dt.getUTCDate()).padStart(2, "0")}`;
}
function parseISODate(iso) {
	const [y, m, d] = iso.split("-").map(Number);
	if (!y || !m || !d) return null;
	return new Date(y, m - 1, d);
}
function sentence(value) {
	return value ? value.charAt(0).toUpperCase() + value.slice(1) : value;
}
function formatDay(iso) {
	const date = parseISODate(iso);
	if (!date) return "Sem data";
	return sentence(new Intl.DateTimeFormat("pt-BR", {
		weekday: "short",
		day: "numeric",
		month: "short"
	}).format(date));
}
function formatShort(iso) {
	const date = parseISODate(iso);
	if (!date) return "";
	return new Intl.DateTimeFormat("pt-BR", {
		day: "numeric",
		month: "short"
	}).format(date);
}
function formatMonth(year, month) {
	const label = new Intl.DateTimeFormat("pt-BR", {
		month: "long",
		year: "numeric"
	}).format(new Date(year, month, 1));
	return label.charAt(0).toUpperCase() + label.slice(1);
}
function money(n) {
	if (n == null || Number.isNaN(n)) return "—";
	return new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL"
	}).format(n);
}
function moneyInput(n) {
	if (n == null) return "";
	return n.toLocaleString("pt-BR", { maximumFractionDigits: 2 });
}
function parseMoney(input) {
	const t = input.trim();
	if (!t) return null;
	let s = t.replace(/[^\d,.-]/g, "");
	if (!s) return null;
	if (s.includes(",")) s = s.replace(/\./g, "").replace(",", ".");
	const n = Number(s);
	return Number.isNaN(n) ? null : n;
}
function norm(s) {
	return s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").trim();
}
function digits(s) {
	return s.replace(/\D/g, "");
}
function initials(name) {
	const parts = name.trim().split(/\s+/).filter(Boolean);
	if (!parts.length) return "?";
	if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
	return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
function greeting(now = /* @__PURE__ */ new Date()) {
	const h = Number(new Intl.DateTimeFormat("en-US", {
		timeZone: TZ,
		hour: "numeric",
		hourCycle: "h23"
	}).format(now));
	if (h < 12) return "Bom dia";
	if (h < 18) return "Boa tarde";
	return "Boa noite";
}
function apptName(a, clients) {
	if (a.clientId) {
		const c = clients.find((x) => x.id === a.clientId);
		if (c?.name.trim()) return c.name.trim();
	}
	return a.guestName.trim() || "Sem nome";
}
function clientById(clients, id) {
	if (!id) return void 0;
	return clients.find((c) => c.id === id);
}
function statsFor(clientId, appointments) {
	const list = appointments.filter((a) => a.clientId === clientId);
	const notCancelled = list.filter((a) => a.visitStatus !== "cancelado");
	const came = list.filter((a) => a.visitStatus === "realizado");
	const missed = list.filter((a) => a.visitStatus === "faltou");
	const sum = (rows, pred) => rows.filter(pred).reduce((s, a) => s + (a.value ?? 0), 0);
	const dates = (rows) => rows.map((a) => a.date).filter(Boolean).sort();
	return {
		booked: list.length,
		came: came.length,
		missed: missed.length,
		charged: sum(notCancelled, () => true),
		received: sum(list, (a) => a.payStatus === "pago"),
		open: sum(notCancelled, (a) => a.payStatus !== "pago"),
		lastCame: dates(came).at(-1) ?? "",
		lastBooked: dates(notCancelled).at(-1) ?? "",
		history: [...list].sort(compareApptDesc)
	};
}
function compareAppt(a, b) {
	const da = a.date || "9999-99-99";
	const db = b.date || "9999-99-99";
	if (da !== db) return da < db ? -1 : 1;
	const ta = a.time || "99:99";
	const tb = b.time || "99:99";
	if (ta !== tb) return ta < tb ? -1 : 1;
	return a.createdAt.localeCompare(b.createdAt);
}
function compareApptDesc(a, b) {
	return compareAppt(b, a);
}
function isOpenPayment(a) {
	return a.payStatus !== "pago" && a.visitStatus !== "cancelado";
}
function dueReminders(appointments, today) {
	return appointments.filter((a) => {
		if (a.payStatus === "pago" || a.visitStatus === "cancelado" || a.reminderDone) return false;
		if (a.reminderDate && a.reminderDate <= today) return true;
		if (a.payStatus === "combinado" && a.payDueDate && a.payDueDate <= today) return true;
		return false;
	}).sort(compareAppt);
}
function upcomingBirthdays(clients, today = /* @__PURE__ */ new Date(), within = 14) {
	const start = parseISODate(todayISO(today));
	if (!start) return [];
	const hits = [];
	for (const client of clients) {
		if (!client.birthday) continue;
		const parsed = parseISODate(client.birthday);
		if (!parsed) continue;
		let when = new Date(start.getFullYear(), parsed.getMonth(), parsed.getDate());
		if (when < start) when = new Date(start.getFullYear() + 1, parsed.getMonth(), parsed.getDate());
		const inDays = Math.round((when.getTime() - start.getTime()) / 864e5);
		if (inDays >= 0 && inDays <= within) {
			const mm = String(when.getMonth() + 1).padStart(2, "0");
			const dd = String(when.getDate()).padStart(2, "0");
			hits.push({
				client,
				when: `${when.getFullYear()}-${mm}-${dd}`,
				inDays
			});
		}
	}
	return hits.sort((a, b) => a.inDays - b.inDays);
}
function inMonth(iso, year, month) {
	if (!iso) return false;
	const [y, m] = iso.split("-").map(Number);
	return y === year && m === month + 1;
}
function weekIndex(iso) {
	const date = parseISODate(iso);
	if (!date) return 0;
	return Math.floor((date.getDate() - 1) / 7);
}
function weekLabel(index) {
	return `Sem ${index + 1}`;
}
function shiftMonth(year, month, delta) {
	const d = new Date(year, month + delta, 1);
	return {
		year: d.getFullYear(),
		month: d.getMonth()
	};
}
function startOfWeek(iso) {
	const date = parseISODate(iso) ?? /* @__PURE__ */ new Date();
	const pad = (date.getDay() + 6) % 7;
	date.setDate(date.getDate() - pad);
	return todayISO(date);
}
function weekDays(iso) {
	const start = parseISODate(startOfWeek(iso)) ?? /* @__PURE__ */ new Date();
	return Array.from({ length: 7 }, (_, i) => {
		return todayISO(new Date(start.getFullYear(), start.getMonth(), start.getDate() + i));
	});
}
function monthCells(year, month) {
	const pad = (new Date(year, month, 1).getDay() + 6) % 7;
	const count = new Date(year, month + 1, 0).getDate();
	const cells = [];
	for (let i = 0; i < pad; i++) cells.push(null);
	for (let day = 1; day <= count; day++) {
		const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
		cells.push({
			iso,
			day
		});
	}
	return cells;
}
function waLink(phone, text) {
	let n = digits(phone);
	if (!n) return null;
	if (n.length <= 11) n = `55${n}`;
	return `https://wa.me/${n}?text=${encodeURIComponent(text)}`;
}
function chargeMessage(opts) {
	const first = opts.name.trim().split(/\s+/)[0];
	const bits = [`Oi${first ? ` ${first}` : ""}, tudo bem?`];
	const about = [
		"Passando para lembrar do pagamento",
		opts.serviceName ? `de ${opts.serviceName.toLowerCase()}` : "",
		opts.value != null ? `no valor de ${money(opts.value)}` : "",
		opts.date ? `do dia ${formatShort(opts.date)}` : ""
	].filter(Boolean).join(" ");
	bits.push(`${about}.`);
	if (opts.payDueDate) bits.push(`Ficou combinado para ${formatShort(opts.payDueDate)}.`);
	if (opts.pixKey.trim()) bits.push(`PIX: ${opts.pixKey.trim()}`);
	bits.push("Obrigada.");
	return bits.join(" ");
}
function blankClient() {
	return {
		name: "",
		phone: "",
		email: "",
		notes: "",
		birthday: "",
		source: ""
	};
}
function clientToDraft(c) {
	return {
		id: c.id,
		name: c.name,
		phone: c.phone,
		email: c.email,
		notes: c.notes,
		birthday: c.birthday,
		source: c.source
	};
}
function blankAppt(prefill = {}) {
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
		...prefill
	};
}
function apptToDraft(a, clients) {
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
		saveContact: false
	};
}
function defaultServices() {
	return [
		{
			id: "svc-tarot",
			name: "Consulta de tarot",
			defaultPrice: 150,
			durationMin: 50
		},
		{
			id: "svc-limpeza",
			name: "Limpeza espiritual",
			defaultPrice: 220,
			durationMin: 80
		},
		{
			id: "svc-trabalho",
			name: "Trabalho espiritual",
			defaultPrice: 480,
			durationMin: null
		}
	];
}
function seedBook() {
	const stamp = `${todayISO()}T12:00:00.000Z`;
	const clients = [
		{
			id: "cli-marina",
			name: "Marina Alves",
			phone: "(19) 98821-1044",
			email: "marina.alves@email.com",
			notes: "Prefere pergunta objetiva. Veio por indicação da irmã.",
			birthday: birthdayNear(2, 1991),
			source: "Indicação",
			createdAt: stamp,
			demo: true
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
			demo: true
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
			demo: true
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
			demo: true
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
			demo: true
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
			demo: true
		}
	];
	const A = (partial) => ({
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
		...partial
	});
	return {
		clients,
		appointments: [
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
				notes: "Pergunta sobre trabalho."
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
				reminderNote: "Cobrar no fim do atendimento."
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
				visitStatus: "agendado"
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
				notes: "Combinou pagar ontem."
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
				visitStatus: "realizado"
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
				visitStatus: "realizado"
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
				visitStatus: "agendado"
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
				notes: "Avisou em cima da hora."
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
				visitStatus: "realizado"
			})
		],
		services: defaultServices(),
		settings: defaultSettings()
	};
}
function birthdayNear(offsetDays, year) {
	const [, m, d] = addDays(offsetDays).split("-");
	return `${year}-${m}-${d}`;
}
function snapshot(s) {
	return {
		clients: s.clients,
		appointments: s.appointments,
		services: s.services,
		settings: s.settings
	};
}
function persistBook(book) {
	if (typeof window === "undefined") return;
	localStorage.setItem(STORAGE_KEY, JSON.stringify(book));
}
function readStored() {
	if (typeof window === "undefined") return null;
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		if (!Array.isArray(parsed.clients) || !Array.isArray(parsed.appointments)) return null;
		return {
			clients: parsed.clients,
			appointments: parsed.appointments,
			services: Array.isArray(parsed.services) && parsed.services.length ? parsed.services : defaultServices(),
			settings: {
				...defaultSettings(),
				...parsed.settings ?? {}
			}
		};
	} catch {
		return null;
	}
}
var useBook = create((set, get) => {
	const commit = (partial) => {
		const next = {
			...snapshot(get()),
			...partial
		};
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
			const row = {
				id: draft.id || crypto.randomUUID(),
				name,
				phone: draft.phone.trim(),
				email: draft.email.trim(),
				notes: draft.notes.trim(),
				birthday: draft.birthday,
				source: draft.source.trim(),
				createdAt: get().clients.find((c) => c.id === draft.id)?.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
				demo: get().clients.find((c) => c.id === draft.id)?.demo
			};
			const exists = get().clients.some((c) => c.id === row.id);
			commit({ clients: exists ? get().clients.map((c) => c.id === row.id ? row : c) : [row, ...get().clients] });
			return row.id;
		},
		removeClient: (id) => {
			const client = get().clients.find((c) => c.id === id);
			commit({
				clients: get().clients.filter((c) => c.id !== id),
				appointments: get().appointments.map((a) => a.clientId === id ? {
					...a,
					clientId: null,
					guestName: a.guestName || client?.name || ""
				} : a)
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
					const created = {
						id: crypto.randomUUID(),
						name: guestName,
						phone: draft.phone.trim(),
						email: "",
						notes: "",
						birthday: "",
						source: "",
						createdAt: (/* @__PURE__ */ new Date()).toISOString()
					};
					clients = [created, ...clients];
					clientId = created.id;
				}
			}
			if (clientId && draft.phone.trim()) {
				const phone = draft.phone.trim();
				clients = clients.map((c) => c.id === clientId && c.phone !== phone ? {
					...c,
					phone
				} : c);
			}
			const prev = draft.id ? get().appointments.find((a) => a.id === draft.id) : void 0;
			const sameReminder = prev && prev.reminderDate === draft.reminderDate;
			const appt = {
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
				createdAt: prev?.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
				paidAt: draft.payStatus === "pago" ? prev?.paidAt || todayISO() : "",
				demo: prev?.demo
			};
			commit({
				clients,
				appointments: prev ? get().appointments.map((a) => a.id === appt.id ? appt : a) : [appt, ...get().appointments]
			});
		},
		removeAppointment: (id) => {
			commit({ appointments: get().appointments.filter((a) => a.id !== id) });
		},
		markPaid: (id) => {
			commit({ appointments: get().appointments.map((a) => a.id === id ? {
				...a,
				payStatus: "pago",
				paidAt: a.paidAt || todayISO(),
				reminderDone: true
			} : a) });
		},
		dismissReminder: (id) => {
			commit({ appointments: get().appointments.map((a) => a.id === id ? {
				...a,
				reminderDone: true
			} : a) });
		},
		addService: () => {
			const row = {
				id: crypto.randomUUID(),
				name: "Novo atendimento",
				defaultPrice: null,
				durationMin: null
			};
			commit({ services: [...get().services, row] });
		},
		updateService: (id, patch) => {
			commit({ services: get().services.map((s) => s.id === id ? {
				...s,
				...patch
			} : s) });
		},
		removeService: (id) => {
			commit({ services: get().services.filter((s) => s.id !== id) });
		},
		updateSettings: (patch) => {
			commit({ settings: {
				...get().settings,
				...patch
			} });
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
				if (clients.some((c) => {
					if (phoneKey && digits(c.phone) === phoneKey) return true;
					if (name && norm(c.name) === norm(name) && (!phoneKey || digits(c.phone) === phoneKey)) return true;
					return false;
				})) {
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
					createdAt: (/* @__PURE__ */ new Date()).toISOString()
				});
				added += 1;
			}
			commit({ clients });
			return {
				added,
				skipped
			};
		},
		mergeBook: (book) => {
			const clients = [...get().clients];
			const appointments = [...get().appointments];
			const services = [...get().services];
			for (const c of book.clients) if (!clients.some((x) => x.id === c.id)) clients.push(c);
			for (const a of book.appointments) if (!appointments.some((x) => x.id === a.id)) appointments.push(a);
			for (const s of book.services) if (!services.some((x) => x.id === s.id)) services.push(s);
			commit({
				clients,
				appointments,
				services,
				settings: {
					...get().settings,
					...book.settings
				}
			});
		},
		replaceBook: (book) => {
			commit({
				clients: book.clients,
				appointments: book.appointments,
				services: book.services.length ? book.services : defaultServices(),
				settings: {
					...defaultSettings(),
					...book.settings
				}
			});
		},
		clearDemo: () => {
			commit({
				clients: get().clients.filter((c) => !c.demo),
				appointments: get().appointments.filter((a) => !a.demo)
			});
		},
		resetAll: () => {
			commit({
				clients: [],
				appointments: [],
				services: defaultServices(),
				settings: defaultSettings()
			});
		}
	};
});
function downloadText(filename, content, mime) {
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
function toCsv(rows) {
	const esc = (cell) => {
		if (/[;"\n]/.test(cell)) return `"${cell.replace(/"/g, "\"\"")}"`;
		return cell;
	};
	return `\uFEFF${rows.map((r) => r.map(esc).join(";")).join("\n")}`;
}
function clientsCsv(book) {
	return toCsv([[
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
		"em_aberto"
	], ...book.clients.slice().sort((a, b) => a.name.localeCompare(b.name, "pt-BR")).map((c) => {
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
			s.open ? String(s.open).replace(".", ",") : ""
		];
	})]);
}
function appointmentsCsv(book) {
	return toCsv([[
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
		"observacoes"
	], ...book.appointments.slice().sort(compareAppt).map((a) => {
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
			a.notes
		];
	})]);
}
function backupJson(book) {
	return JSON.stringify({
		app: "janice-tarot",
		version: 1,
		exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
		...snapshot(book)
	}, null, 2);
}
function cn(...parts) {
	return parts.filter(Boolean).join(" ");
}
function cx(...parts) {
	return parts.filter(Boolean).join(" ");
}
function Button({ variant = "soft", className, type = "button", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type,
		className: cx("inline-flex h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-opacity disabled:opacity-50", variant === "primary" && "bg-accent text-accent-fg", variant === "soft" && "bg-sunken text-fg", variant === "ghost" && "bg-transparent text-fg", variant === "danger" && "bg-transparent text-accent", className),
		...props
	});
}
function IconButton({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		className: cx("inline-flex size-11 items-center justify-center rounded-lg text-fg hover:bg-sunken", className),
		...props
	});
}
function Field({ label, hint, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "mb-1.5 flex items-baseline justify-between gap-3 text-sm text-muted",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs",
			children: hint
		}) : null]
	}), children] });
}
var controlClass = "h-11 w-full rounded-lg border border-line bg-surface px-3 text-fg outline-none placeholder:text-muted focus:border-accent";
function TextInput(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		...props,
		className: cx(controlClass, props.className)
	});
}
function TextArea(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		...props,
		className: cx("min-h-24 w-full rounded-lg border border-line bg-surface px-3 py-2 text-fg outline-none placeholder:text-muted focus:border-accent", props.className)
	});
}
function Choice({ on, children, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		"aria-pressed": on,
		className: cx("h-11 rounded-full border px-3 text-sm", on ? "border-accent bg-accent text-accent-fg" : "border-line bg-surface text-fg"),
		children
	});
}
function Modal({ open, title, onClose, children }) {
	(0, import_react.useEffect)(() => {
		if (!open) return;
		const onKey = (e) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open, onClose]);
	if (!open || typeof document === "undefined") return null;
	return (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 overflow-y-auto bg-fg/40",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex min-h-dvh items-start justify-center sm:items-center sm:p-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				role: "dialog",
				"aria-modal": "true",
				"aria-labelledby": "sheet-title",
				className: "w-full border border-line bg-surface p-5 shadow-sm sm:my-6 sm:max-w-lg sm:rounded-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						id: "sheet-title",
						className: "font-display text-2xl leading-tight text-fg",
						children: title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						"aria-label": "Fechar",
						className: "inline-flex size-11 items-center justify-center rounded-lg hover:bg-sunken",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
					})]
				}), children]
			})
		})
	}), document.body);
}
function Card({ className, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: cx("rounded-xl border border-line bg-surface p-4", className),
		children
	});
}
function PayPill({ label, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex h-7 items-center rounded-full px-2.5 text-xs font-medium", tone === "pago" && "bg-accent text-accent-fg", tone === "pendente" && "bg-sunken text-fg", tone === "nao_pago" && "border border-line text-muted", tone === "combinado" && "border border-accent text-accent"),
		children: label
	});
}
var PAYS = [
	"pago",
	"pendente",
	"nao_pago",
	"combinado"
];
var VISITS = [
	"agendado",
	"realizado",
	"faltou",
	"cancelado"
];
async function copyText(text) {
	try {
		await navigator.clipboard.writeText(text);
		toast.success("Lembrete copiado");
	} catch {
		toast.error("Não consegui copiar");
	}
}
function ApptForm({ draft, onClose }) {
	const clients = useBook((s) => s.clients);
	const services = useBook((s) => s.services);
	const settings = useBook((s) => s.settings);
	const saveAppointment = useBook((s) => s.saveAppointment);
	const removeAppointment = useBook((s) => s.removeAppointment);
	const [form, setForm] = (0, import_react.useState)(draft);
	const [armed, setArmed] = (0, import_react.useState)(false);
	const patch = (partial) => setForm((current) => ({
		...current,
		...partial
	}));
	const suggestions = (0, import_react.useMemo)(() => {
		const q = norm(form.guestName);
		if (!q) return [];
		return clients.filter((c) => norm(c.name).includes(q) || norm(c.phone).includes(q)).slice(0, 4);
	}, [clients, form.guestName]);
	const pickClient = (c) => {
		patch({
			clientId: c.id,
			guestName: c.name,
			phone: c.phone,
			saveContact: false
		});
	};
	const pickService = (id) => {
		if (form.serviceId === id) {
			patch({ serviceId: "" });
			return;
		}
		const service = services.find((s) => s.id === id);
		if (!service) return;
		patch({
			serviceId: service.id,
			serviceName: service.name,
			value: form.value.trim() ? form.value : service.defaultPrice != null ? String(service.defaultPrice).replace(".", ",") : ""
		});
	};
	const linked = clientById(clients, form.clientId || null);
	const showSaveContact = !form.clientId && form.guestName.trim().length > 0 && !clients.some((c) => norm(c.name) === norm(form.guestName));
	const message = chargeMessage({
		name: form.guestName,
		serviceName: form.serviceName,
		value: parseMoney(form.value),
		date: form.date,
		payDueDate: form.payDueDate,
		pixKey: settings.pixKey
	});
	const whatsapp = waLink(form.phone || linked?.phone || "", message);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
		open: true,
		title: form.id ? "Editar horário" : "Novo horário",
		onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "grid gap-4",
			onSubmit: (e) => {
				e.preventDefault();
				saveAppointment(form);
				toast.success(form.id ? "Horário atualizado" : "Horário guardado");
				onClose();
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Nada é obrigatório. Preencha só o que souber."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Nome",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						value: form.guestName,
						placeholder: "Quem vem",
						autoComplete: "off",
						onChange: (e) => patch({
							guestName: e.target.value,
							clientId: ""
						})
					})
				}),
				suggestions.length > 0 && !form.clientId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-1",
					children: suggestions.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => pickClient(c),
						className: "flex h-11 items-center justify-between gap-3 rounded-lg bg-sunken px-3 text-left text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate",
							children: c.name || "Sem nome"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "shrink-0 text-muted",
							children: c.phone
						})]
					}, c.id))
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Dia",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
							type: "date",
							value: form.date,
							onChange: (e) => patch({ date: e.target.value })
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Horário",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
							type: "time",
							value: form.time,
							onChange: (e) => patch({ time: e.target.value })
						})
					})]
				}),
				services.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Tipo de atendimento",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: services.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choice, {
							on: form.serviceId === s.id,
							onClick: () => pickService(s.id),
							children: s.name
						}, s.id))
					})
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Descrição",
					hint: "se quiser outro nome",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						value: form.serviceName,
						placeholder: "Consulta, limpeza, outro",
						onChange: (e) => {
							const serviceName = e.target.value;
							const selected = services.find((s) => s.id === form.serviceId);
							patch({
								serviceName,
								serviceId: selected && selected.name !== serviceName ? "" : form.serviceId
							});
						}
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Valor",
					hint: "R$",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						inputMode: "decimal",
						placeholder: "0",
						value: form.value,
						onChange: (e) => patch({ value: e.target.value })
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Pagamento",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: PAYS.map((status) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choice, {
							on: form.payStatus === status,
							onClick: () => patch({ payStatus: status }),
							children: PAY_LABEL[status]
						}, status))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Vai pagar em",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
							type: "date",
							value: form.payDueDate,
							onChange: (e) => patch({ payDueDate: e.target.value })
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Lembrar em",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
							type: "date",
							value: form.reminderDate,
							onChange: (e) => patch({ reminderDate: e.target.value })
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Nota do lembrete",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						value: form.reminderNote,
						placeholder: "Cobrar no PIX depois do atendimento",
						onChange: (e) => patch({ reminderNote: e.target.value })
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Comparecimento",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: VISITS.map((status) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choice, {
							on: form.visitStatus === status,
							onClick: () => patch({ visitStatus: form.visitStatus === status ? "" : status }),
							children: VISIT_LABEL[status]
						}, status))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Telefone",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						value: form.phone,
						inputMode: "tel",
						placeholder: "(19) 90000-0000",
						onChange: (e) => patch({ phone: e.target.value })
					})
				}),
				showSaveContact ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex min-h-11 items-center gap-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						className: "size-5 accent-accent",
						checked: form.saveContact,
						onChange: (e) => patch({ saveContact: e.target.checked })
					}), "Guardar também na lista de contatos"]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Observação",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
						value: form.notes,
						placeholder: "O que ficou combinado",
						onChange: (e) => patch({ notes: e.target.value })
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: () => void copyText(message),
						children: "Copiar lembrete"
					}), whatsapp ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: whatsapp,
						target: "_blank",
						rel: "noreferrer",
						className: "inline-flex h-11 items-center rounded-lg bg-sunken px-4 text-sm font-medium",
						children: "WhatsApp"
					}) : null]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "primary",
					type: "submit",
					className: "w-full",
					children: "Salvar"
				}),
				form.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "danger",
					className: "w-full",
					onClick: () => {
						if (!armed) {
							setArmed(true);
							return;
						}
						removeAppointment(form.id ?? "");
						toast.success("Horário apagado");
						onClose();
					},
					children: armed ? "Confirmar exclusão" : "Excluir horário"
				}) : null
			]
		})
	});
}
function ClientForm({ draft, onClose, onBook, onOpenAppointment }) {
	const appointments = useBook((s) => s.appointments);
	const settings = useBook((s) => s.settings);
	const saveClient = useBook((s) => s.saveClient);
	const removeClient = useBook((s) => s.removeClient);
	const [form, setForm] = (0, import_react.useState)(draft);
	const [armed, setArmed] = (0, import_react.useState)(false);
	const patch = (partial) => setForm((current) => ({
		...current,
		...partial
	}));
	const stats = form.id ? statsFor(form.id, appointments) : null;
	const openValue = stats && stats.open > 0 ? stats.open : null;
	const whatsapp = waLink(form.phone, chargeMessage({
		name: form.name,
		serviceName: "atendimento",
		value: openValue,
		date: "",
		payDueDate: "",
		pixKey: settings.pixKey
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
		open: true,
		title: form.id ? form.name || "Contato" : "Novo contato",
		onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "grid gap-4",
			onSubmit: (e) => {
				e.preventDefault();
				const id = saveClient(form);
				setForm((current) => ({
					...current,
					id
				}));
				toast.success("Contato salvo");
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Nome",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						value: form.name,
						placeholder: "Nome",
						onChange: (e) => patch({ name: e.target.value })
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Telefone",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
							inputMode: "tel",
							value: form.phone,
							placeholder: "WhatsApp",
							onChange: (e) => patch({ phone: e.target.value })
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "E-mail",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
							inputMode: "email",
							value: form.email,
							placeholder: "opcional",
							onChange: (e) => patch({ email: e.target.value })
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Aniversário",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
							type: "date",
							value: form.birthday,
							onChange: (e) => patch({ birthday: e.target.value })
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Como chegou",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
							value: form.source,
							placeholder: "Indicação, Instagram",
							onChange: (e) => patch({ source: e.target.value })
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Observações",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
						value: form.notes,
						onChange: (e) => patch({ notes: e.target.value })
					})
				}),
				stats ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Marcou",
							value: String(stats.booked)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Veio",
							value: String(stats.came)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Última vez",
							value: stats.lastCame ? formatShort(stats.lastCame) : "ainda não"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Faltou",
							value: String(stats.missed)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Cobrado",
							value: money(stats.charged)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Recebido",
							value: money(stats.received)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-span-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Em aberto",
								value: money(stats.open)
							})
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Salve o contato para começar o histórico."
				}),
				stats && stats.history.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Histórico"
					}), stats.history.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => onOpenAppointment(a),
						className: "flex min-h-11 items-center justify-between gap-3 rounded-lg bg-sunken px-3 py-2 text-left text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block truncate font-medium",
								children: a.serviceName || "Atendimento"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted",
								children: [a.date ? formatShort(a.date) : "Sem data", a.time].filter(Boolean).join(" · ")
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "shrink-0 tabular-nums",
							children: money(a.value)
						})]
					}, a.id))]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "primary",
							type: "submit",
							children: "Salvar contato"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => {
								const id = saveClient(form);
								setForm((current) => ({
									...current,
									id
								}));
								onBook({
									clientId: id,
									guestName: form.name,
									phone: form.phone,
									saveContact: false
								});
							},
							children: "Marcar horário"
						}),
						whatsapp ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: whatsapp,
							target: "_blank",
							rel: "noreferrer",
							className: "inline-flex h-11 items-center rounded-lg bg-sunken px-4 text-sm font-medium",
							children: "WhatsApp"
						}) : null
					]
				}),
				form.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "danger",
					onClick: () => {
						if (!armed) {
							setArmed(true);
							return;
						}
						removeClient(form.id ?? "");
						toast.success("Contato apagado");
						onClose();
					},
					children: armed ? "Confirmar exclusão" : "Excluir contato"
				}) : null
			]
		})
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg bg-sunken px-3 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-medium tabular-nums",
			children: value
		})]
	});
}
var StudioContext = (0, import_react.createContext)(null);
function StudioProvider({ value, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudioContext.Provider, {
		value,
		children
	});
}
function useStudio() {
	const ctx = (0, import_react.useContext)(StudioContext);
	if (!ctx) throw new Error("Fora do estúdio");
	return ctx;
}
var PAY = [
	"pago",
	"pendente",
	"nao_pago",
	"combinado"
];
var VISIT = [
	"",
	"agendado",
	"realizado",
	"faltou",
	"cancelado"
];
function asString(v) {
	return typeof v === "string" ? v : "";
}
function asBool(v) {
	return v === true;
}
function asPay(v) {
	return PAY.includes(v) ? v : "pendente";
}
function asVisit(v) {
	return VISIT.includes(v) ? v : "";
}
function asNumber(v) {
	if (typeof v === "number" && !Number.isNaN(v)) return v;
	if (typeof v === "string") return parseMoney(v);
	return null;
}
function asClient(v) {
	if (!v || typeof v !== "object") return null;
	const o = v;
	return {
		id: asString(o.id) || crypto.randomUUID(),
		name: asString(o.name),
		phone: asString(o.phone),
		email: asString(o.email),
		notes: asString(o.notes),
		birthday: asString(o.birthday),
		source: asString(o.source),
		createdAt: asString(o.createdAt) || (/* @__PURE__ */ new Date()).toISOString(),
		demo: asBool(o.demo)
	};
}
function asAppointment(v) {
	if (!v || typeof v !== "object") return null;
	const o = v;
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
		createdAt: asString(o.createdAt) || (/* @__PURE__ */ new Date()).toISOString(),
		paidAt: asString(o.paidAt),
		demo: asBool(o.demo)
	};
}
function asService(v) {
	if (!v || typeof v !== "object") return null;
	const o = v;
	const name = asString(o.name).trim();
	if (!name) return null;
	return {
		id: asString(o.id) || crypto.randomUUID(),
		name,
		defaultPrice: asNumber(o.defaultPrice),
		durationMin: asNumber(o.durationMin)
	};
}
function parseBackup(text) {
	try {
		const data = JSON.parse(text);
		if (!data || typeof data !== "object") return null;
		const clients = Array.isArray(data.clients) ? data.clients.map(asClient).filter((x) => !!x) : null;
		const appointments = Array.isArray(data.appointments) ? data.appointments.map(asAppointment).filter((x) => !!x) : null;
		if (!clients || !appointments) return null;
		const services = Array.isArray(data.services) ? data.services.map(asService).filter((x) => !!x) : [];
		const rawSettings = data.settings ?? {};
		return {
			clients,
			appointments,
			services,
			settings: {
				studioName: asString(rawSettings.studioName) || "Janice Tarot",
				practitioner: asString(rawSettings.practitioner) || "Janice",
				pixKey: asString(rawSettings.pixKey)
			}
		};
	} catch {
		return null;
	}
}
function parseVcards(text) {
	const chunks = text.split(/BEGIN:VCARD/i).slice(1);
	const rows = [];
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
			const value = line.slice(idx + 1).trim().replace(/\\n/g, "\n").replace(/\\,/g, ",");
			if (!value || value.toUpperCase() === "END") continue;
			if (key === "FN" && !name) name = value;
			else if (key === "TEL" && !phone) phone = value;
			else if (key === "EMAIL" && !email) email = value;
			else if (key === "NOTE" && !notes) notes = value;
			else if (key === "BDAY" && !birthday) birthday = normalizeBirthday(value);
		}
		if (!name && !phone && !email) continue;
		rows.push({
			name,
			phone,
			email,
			notes,
			birthday,
			source: "Agenda"
		});
	}
	return rows;
}
function normalizeBirthday(value) {
	const iso = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
	if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;
	const md = value.match(/^--(\d{2})-(\d{2})/);
	if (md) return `1900-${md[1]}-${md[2]}`;
	return "";
}
function splitCsvLine(line, sep) {
	const out = [];
	let cur = "";
	let quoted = false;
	for (let i = 0; i < line.length; i++) {
		const ch = line[i];
		if (quoted) {
			if (ch === "\"") {
				if (line[i + 1] === "\"") {
					cur += "\"";
					i += 1;
				} else quoted = false;
			} else cur += ch;
		} else if (ch === "\"") quoted = true;
		else if (ch === sep) {
			out.push(cur);
			cur = "";
		} else cur += ch;
	}
	out.push(cur);
	return out;
}
function findHeader(headers, candidates, mode) {
	const normalized = headers.map((h) => norm(h));
	for (const candidate of candidates) {
		const target = norm(candidate);
		const index = normalized.findIndex((h) => mode === "exact" ? h === target : h.includes(target));
		if (index >= 0) return index;
	}
	return -1;
}
function parseContactsCsv(text) {
	const clean = text.replace(/^\uFEFF/, "").trim();
	if (!clean) return [];
	const lines = clean.split(/\r?\n/).filter((l) => l.trim());
	if (lines.length < 2) return [];
	const sep = (lines[0].match(/;/g) ?? []).length > (lines[0].match(/,/g) ?? []).length ? ";" : ",";
	const headers = splitCsvLine(lines[0], sep).map((h) => h.trim());
	const nameI = findHeader(headers, [
		"nome",
		"name",
		"full name",
		"nome completo"
	], "exact");
	const givenI = findHeader(headers, [
		"given name",
		"primeiro nome",
		"first name"
	], "includes");
	const familyI = findHeader(headers, [
		"family name",
		"sobrenome",
		"last name"
	], "includes");
	const phoneI = findHeader(headers, [
		"telefone",
		"celular",
		"phone",
		"mobile",
		"whatsapp"
	], "includes");
	const emailI = findHeader(headers, ["e-mail", "email"], "includes");
	const noteI = findHeader(headers, [
		"observacao",
		"observacoes",
		"notas",
		"notes",
		"note"
	], "includes");
	const bdayI = findHeader(headers, [
		"aniversario",
		"birthday",
		"birth"
	], "includes");
	const rows = [];
	for (const line of lines.slice(1)) {
		const cols = splitCsvLine(line, sep);
		const at = (i) => i >= 0 ? (cols[i] ?? "").trim() : "";
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
			source: "Agenda"
		});
	}
	return rows;
}
function looksLikeBackup(text) {
	const t = text.trim();
	if (!t.startsWith("{")) return false;
	return t.includes("\"clients\"") || t.includes("\"appointments\"");
}
function payText(a) {
	if (a.payStatus === "combinado" && a.payDueDate) return `Vai pagar ${formatShort(a.payDueDate)}`;
	return PAY_LABEL[a.payStatus];
}
function ApptCard({ a, showDate = false }) {
	const clients = useBook((s) => s.clients);
	const markPaid = useBook((s) => s.markPaid);
	const { openAppt } = useStudio();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "rounded-xl border border-line bg-surface p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => openAppt(apptToDraft(a, clients)),
			className: "w-full text-left",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-baseline justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "min-w-0 truncate font-medium",
					children: apptName(a, clients)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "shrink-0 text-sm tabular-nums text-muted",
					children: [showDate ? formatShort(a.date) : a.time || "sem hora", showDate && a.time ? ` · ${a.time}` : ""]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "truncate text-sm text-muted",
				children: [
					a.serviceName || "Sem tipo",
					" · ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tabular-nums",
						children: money(a.value)
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-2 flex flex-wrap items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PayPill, {
					label: payText(a),
					tone: a.payStatus
				}),
				a.visitStatus ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-muted",
					children: VISIT_LABEL[a.visitStatus]
				}) : null,
				a.payStatus !== "pago" && a.visitStatus !== "cancelado" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "ml-auto h-11 rounded-lg bg-sunken px-3 text-sm font-medium",
					onClick: () => {
						markPaid(a.id);
						toast.success("Marcado como pago");
					},
					children: "Recebi"
				}) : null
			]
		})]
	});
}
function TodayView() {
	const appointments = useBook((s) => s.appointments);
	const clients = useBook((s) => s.clients);
	const settings = useBook((s) => s.settings);
	const dismissReminder = useBook((s) => s.dismissReminder);
	const { openAppt, openClient } = useStudio();
	const today = todayISO();
	const now = /* @__PURE__ */ new Date();
	const monthAppts = appointments.filter((a) => inMonth(a.date, now.getFullYear(), now.getMonth()));
	const received = monthAppts.filter((a) => a.payStatus === "pago").reduce((s, a) => s + (a.value ?? 0), 0);
	const open = monthAppts.filter(isOpenPayment).reduce((s, a) => s + (a.value ?? 0), 0);
	const todayList = appointments.filter((a) => a.date === today).sort(compareAppt);
	const reminders = dueReminders(appointments, today);
	const birthdays = upcomingBirthdays(clients, now, 10);
	const upcoming = appointments.filter((a) => a.date > today && a.visitStatus !== "cancelado").sort(compareAppt).slice(0, 5);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "font-display text-3xl text-fg",
				children: [
					greeting(now),
					", ",
					settings.practitioner || "Janice"
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-muted",
				children: [formatDay(today), " · caixa do mês"]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-3 gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: "Hoje"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-2xl tabular-nums",
							children: todayList.length
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: "Recebido"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-lg tabular-nums leading-tight",
							children: money(received)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: "A receber"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-lg tabular-nums leading-tight",
							children: money(open)
						})]
					})
				]
			}),
			reminders.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl",
					children: "Lembretes de pagamento"
				}), reminders.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "grid gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "text-left",
						onClick: () => openAppt(apptToDraft(a, clients)),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: apptName(a, clients)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted",
							children: [
								payText(a),
								a.value != null ? ` · ${money(a.value)}` : "",
								a.reminderNote ? ` · ${a.reminderNote}` : ""
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "primary",
							onClick: () => {
								useBook.getState().markPaid(a.id);
								toast.success("Marcado como pago");
							},
							children: "Recebi"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							onClick: () => dismissReminder(a.id),
							children: "Dispensar"
						})]
					})]
				}, a.id))]
			}) : null,
			birthdays.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl",
					children: "Aniversários"
				}), birthdays.map(({ client, inDays }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => openClient(clientToDraft(client)),
					className: "flex min-h-11 items-center justify-between rounded-xl border border-line bg-surface px-3 text-left",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: client.name || "Sem nome" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm text-muted",
						children: inDays === 0 ? "hoje" : `em ${inDays} dia${inDays > 1 ? "s" : ""}`
					})]
				}, client.id))]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl",
						children: "Agenda de hoje"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: () => openAppt(blankAppt({ date: today })),
						children: "Marcar"
					})]
				}), todayList.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted",
					children: "Dia livre. Quando quiser, marque um horário — o nome já basta."
				}) }) : todayList.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApptCard, { a }, a.id))]
			}),
			upcoming.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl",
					children: "Próximos"
				}), upcoming.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApptCard, {
					a,
					showDate: true
				}, a.id))]
			}) : null
		]
	});
}
function AgendaView() {
	const appointments = useBook((s) => s.appointments);
	const clients = useBook((s) => s.clients);
	const { openAppt } = useStudio();
	const today = todayISO();
	const [selected, setSelected] = (0, import_react.useState)(today);
	const [mode, setMode] = (0, import_react.useState)("dia");
	const [pay, setPay] = (0, import_react.useState)("todos");
	const [query, setQuery] = (0, import_react.useState)("");
	const now = /* @__PURE__ */ new Date();
	const [cursor, setCursor] = (0, import_react.useState)({
		year: now.getFullYear(),
		month: now.getMonth()
	});
	const matches = (a) => {
		if (pay !== "todos" && a.payStatus !== pay) return false;
		if (!query.trim()) return true;
		return norm(`${apptName(a, clients)} ${a.serviceName} ${a.notes}`).includes(norm(query));
	};
	const selectedDate = selected;
	const dayList = appointments.filter((a) => a.date === selectedDate && matches(a)).sort(compareAppt);
	const week = weekDays(selectedDate);
	const cells = monthCells(cursor.year, cursor.month);
	const undated = appointments.filter((a) => !a.date && matches(a));
	const goMonth = (delta) => {
		const next = shiftMonth(cursor.year, cursor.month, delta);
		setCursor(next);
		const day = selectedDate.slice(8, 10);
		const last = new Date(next.year, next.month + 1, 0).getDate();
		const safe = Math.min(Number(day) || 1, last);
		const iso = `${next.year}-${String(next.month + 1).padStart(2, "0")}-${String(safe).padStart(2, "0")}`;
		setSelected(iso);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [[
					"dia",
					"semana",
					"mes"
				].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choice, {
					on: mode === item,
					onClick: () => setMode(item),
					children: item === "dia" ? "Dia" : item === "semana" ? "Semana" : "Mês"
				}, item)), selected !== today ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					onClick: () => {
						setSelected(today);
						setCursor({
							year: now.getFullYear(),
							month: now.getMonth()
						});
					},
					children: "Hoje"
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-[auto_1fr_auto] items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
						"aria-label": "Mês anterior",
						onClick: () => goMonth(-1),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-center font-display text-xl",
						children: formatMonth(cursor.year, cursor.month)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
						"aria-label": "Próximo mês",
						onClick: () => goMonth(1),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-5" })
					})
				]
			}),
			mode === "mes" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-7 gap-1",
				children: [[
					"2ª",
					"3ª",
					"4ª",
					"5ª",
					"6ª",
					"S",
					"D"
				].map((label) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "py-1 text-center text-xs text-muted",
					children: label
				}, label)), cells.map((cell, index) => cell ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setSelected(cell.iso),
					className: "flex h-11 flex-col items-center justify-center rounded-lg text-sm " + (cell.iso === selected ? "bg-accent text-accent-fg" : cell.iso === today ? "border border-accent bg-surface text-fg" : "bg-surface text-fg"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: cell.day }), appointments.some((a) => a.date === cell.iso) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-0.5 size-1 rounded-full bg-current" }) : null]
				}, cell.iso) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}, `e-${index}`))]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-7 gap-1",
				children: week.map((iso) => {
					const day = Number(iso.slice(8, 10));
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => {
							setSelected(iso);
							const date = new Date(Number(iso.slice(0, 4)), Number(iso.slice(5, 7)) - 1, day);
							setCursor({
								year: date.getFullYear(),
								month: date.getMonth()
							});
						},
						className: "flex h-14 flex-col items-center justify-center rounded-lg text-sm " + (iso === selected ? "bg-accent text-accent-fg" : "bg-surface text-fg"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs opacity-80",
							children: [
								"2ª",
								"3ª",
								"4ª",
								"5ª",
								"6ª",
								"S",
								"D"
							][(new Date(Number(iso.slice(0, 4)), Number(iso.slice(5, 7)) - 1, day).getDay() + 6) % 7]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tabular-nums",
							children: day
						})]
					}, iso);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
				value: query,
				placeholder: "Buscar nome ou tipo",
				onChange: (e) => setQuery(e.target.value)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex min-w-0 gap-2 overflow-x-auto",
				children: [
					["todos", "Todos"],
					["pago", "Pagos"],
					["pendente", "Pendentes"],
					["nao_pago", "Não pagos"],
					["combinado", "Vai pagar"]
				].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choice, {
					on: pay === id,
					onClick: () => setPay(id),
					children: label
				}, id))
			}),
			mode === "semana" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4",
				children: week.map((iso) => {
					const list = appointments.filter((a) => a.date === iso && matches(a)).sort(compareAppt);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "grid gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm text-muted",
							children: formatDay(iso)
						}), list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "Nada marcado."
						}) : list.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApptCard, { a }, a.id))]
					}, iso);
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl",
						children: formatDay(selectedDate)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "primary",
						onClick: () => openAppt(blankAppt({ date: selectedDate })),
						children: "Marcar"
					})]
				}), dayList.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted",
					children: "Nenhum horário neste dia."
				}) }) : dayList.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApptCard, { a }, a.id))]
			}),
			undated.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl",
					children: "Sem data"
				}), undated.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApptCard, { a }, a.id))]
			}) : null
		]
	});
}
function ClientsView() {
	const clients = useBook((s) => s.clients);
	const appointments = useBook((s) => s.appointments);
	const { openClient } = useStudio();
	const [query, setQuery] = (0, import_react.useState)("");
	const [filter, setFilter] = (0, import_react.useState)("todos");
	const month = todayISO().slice(5, 7);
	const rows = clients.filter((c) => {
		const stats = statsFor(c.id, appointments);
		if (filter === "devendo" && stats.open <= 0) return false;
		if (filter === "aniversario" && c.birthday.slice(5, 7) !== month) return false;
		if (!query.trim()) return true;
		return norm(`${c.name} ${c.phone} ${c.email} ${c.notes}`).includes(norm(query));
	}).sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl",
					children: "Contatos"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "primary",
					onClick: () => openClient(blankClient()),
					children: "Novo"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
				value: query,
				placeholder: "Buscar nome ou telefone",
				onChange: (e) => setQuery(e.target.value)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choice, {
						on: filter === "todos",
						onClick: () => setFilter("todos"),
						children: "Todos"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choice, {
						on: filter === "devendo",
						onClick: () => setFilter("devendo"),
						children: "Em aberto"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choice, {
						on: filter === "aniversario",
						onClick: () => setFilter("aniversario"),
						children: "Aniversário do mês"
					})
				]
			}),
			rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted",
				children: "Nenhum contato aqui. Você pode criar um agora ou importar a agenda em Mais."
			}) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-2",
				children: rows.map((c) => {
					const stats = statsFor(c.id, appointments);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => openClient(clientToDraft(c)),
						className: "flex items-center gap-3 rounded-xl border border-line bg-surface p-3 text-left",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid size-11 shrink-0 place-items-center rounded-full bg-sunken font-display text-accent",
								children: initials(c.name)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block truncate font-medium",
									children: c.name || "Sem nome"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "block truncate text-sm text-muted",
									children: [
										"marcou ",
										stats.booked,
										" · veio ",
										stats.came,
										stats.lastCame ? ` · última ${formatShort(stats.lastCame)}` : " · ainda não veio"
									]
								})]
							}),
							stats.open > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "shrink-0 text-sm tabular-nums text-accent",
								children: money(stats.open)
							}) : null
						]
					}, c.id);
				})
			})
		]
	});
}
function FinanceView() {
	const appointments = useBook((s) => s.appointments);
	const clients = useBook((s) => s.clients);
	const { openAppt } = useStudio();
	const now = /* @__PURE__ */ new Date();
	const [cursor, setCursor] = (0, import_react.useState)({
		year: now.getFullYear(),
		month: now.getMonth()
	});
	const [perWeek, setPerWeek] = (0, import_react.useState)(8);
	const [ticket, setTicket] = (0, import_react.useState)(180);
	const [weeks, setWeeks] = (0, import_react.useState)(4);
	const [showRate, setShowRate] = (0, import_react.useState)(85);
	const [payRate, setPayRate] = (0, import_react.useState)(75);
	const monthAppts = appointments.filter((a) => inMonth(a.date, cursor.year, cursor.month) && a.visitStatus !== "cancelado");
	const received = monthAppts.filter((a) => a.payStatus === "pago").reduce((s, a) => s + (a.value ?? 0), 0);
	const pending = monthAppts.filter((a) => a.payStatus === "pendente").reduce((s, a) => s + (a.value ?? 0), 0);
	const promised = monthAppts.filter((a) => a.payStatus === "combinado").reduce((s, a) => s + (a.value ?? 0), 0);
	const unpaid = monthAppts.filter((a) => a.payStatus === "nao_pago").reduce((s, a) => s + (a.value ?? 0), 0);
	const undated = appointments.filter((a) => !a.date && a.visitStatus !== "cancelado" && a.payStatus !== "pago").reduce((s, a) => s + (a.value ?? 0), 0);
	const chart = (0, import_react.useMemo)(() => {
		const last = new Date(cursor.year, cursor.month + 1, 0).getDate();
		const buckets = [];
		for (let i = 0; i * 7 + 1 <= last; i++) {
			const rows = monthAppts.filter((a) => weekIndex(a.date) === i);
			buckets.push({
				label: weekLabel(i),
				Recebido: rows.filter((a) => a.payStatus === "pago").reduce((s, a) => s + (a.value ?? 0), 0),
				Aberto: rows.filter((a) => a.payStatus !== "pago").reduce((s, a) => s + (a.value ?? 0), 0)
			});
		}
		return buckets;
	}, [
		cursor.month,
		cursor.year,
		monthAppts
	]);
	const byService = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
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
	const applyPreset = (kind) => {
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-[auto_1fr_auto] items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
						"aria-label": "Mês anterior",
						onClick: () => setCursor(shiftMonth(cursor.year, cursor.month, -1)),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-center font-display text-2xl",
						children: formatMonth(cursor.year, cursor.month)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
						"aria-label": "Próximo mês",
						onClick: () => setCursor(shiftMonth(cursor.year, cursor.month, 1)),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-5" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: "Recebido"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-xl tabular-nums",
							children: money(received)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: "Pendente"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-xl tabular-nums",
							children: money(pending)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: "Vai pagar"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-xl tabular-nums",
							children: money(promised)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: "Não pago"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-xl tabular-nums",
							children: money(unpaid)
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "grid gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl",
						children: "Como entrou no mês"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-4 text-xs text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "size-2 rounded-full bg-accent" }), " Recebido"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "size-2 rounded-full bg-muted" }), " Em aberto"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-56 w-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: chart,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										vertical: false,
										stroke: "var(--color-line)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "label",
										tickLine: false,
										axisLine: false,
										tick: {
											fill: "var(--color-muted)",
											fontSize: 12
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { hide: true }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
										cursor: { fill: "var(--color-sunken)" },
										formatter: (value) => money(typeof value === "number" ? value : Number(value ?? 0)),
										contentStyle: {
											background: "var(--color-surface)",
											border: "1px solid var(--color-line)",
											borderRadius: 12,
											color: "var(--color-fg)"
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "Recebido",
										fill: "var(--color-accent)",
										radius: [
											6,
											6,
											0,
											0
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "Aberto",
										fill: "var(--color-muted)",
										radius: [
											6,
											6,
											0,
											0
										]
									})
								]
							})
						})
					}),
					byService.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Nenhum valor neste mês ainda."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-3",
						children: byService.map(([name, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-1 flex items-baseline justify-between gap-3 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular-nums",
								children: money(value)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-2 overflow-hidden rounded-full bg-sunken",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full rounded-full bg-accent",
								style: { width: `${Math.max(4, value / maxService * 100)}%` }
							})
						})] }, name))
					}),
					undated > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: [
							"Há ",
							money(undated),
							" em horários sem data, fora deste gráfico."
						]
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "grid gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl",
						children: "Simulador de cenário"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Um chute honesto de caixa. Não mexe na agenda de verdade."
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => applyPreset("devagar"),
								children: "Devagar"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => applyPreset("ritmo"),
								children: "No ritmo do mês"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => applyPreset("cheio"),
								children: "Agenda cheia"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
						label: "Atendimentos por semana",
						value: perWeek,
						min: 0,
						max: 30,
						onChange: setPerWeek
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
						label: "Valor médio",
						value: ticket,
						min: 0,
						max: 1500,
						step: 10,
						prefix: "R$ ",
						onChange: setTicket
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
						label: "Semanas no mês",
						value: weeks,
						min: 1,
						max: 6,
						onChange: setWeeks
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
						label: "Quem comparece",
						value: showRate,
						min: 0,
						max: 100,
						suffix: "%",
						onChange: setShowRate
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
						label: "Quem paga no mês",
						value: payRate,
						min: 0,
						max: 100,
						suffix: "%",
						onChange: setPayRate
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: [
							perWeek,
							" por semana × ",
							money(ticket),
							" × ",
							weeks,
							" semanas, com ",
							showRate,
							"% de presença e ",
							payRate,
							"% recebidos no mês."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-2 sm:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "bg-sunken p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted",
									children: "Se todos viessem e pagassem"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-xl tabular-nums",
									children: money(potential)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "bg-sunken p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted",
									children: "Depois das faltas"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-xl tabular-nums",
									children: money(afterShow)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted",
									children: "Caixa estimado"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-xl tabular-nums text-accent",
									children: money(cash)
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm",
						children: [
							"Se cobrar ",
							money(20),
							" a mais em cada atendimento, entram cerca de ",
							money(plus20),
							" a mais no caixa. Neste mês você já recebeu ",
							money(received),
							"."
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl",
					children: "Movimentos"
				}), monthAppts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Sem atendimentos neste mês."
				}) : [...monthAppts].sort(compareAppt).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => openAppt(apptToDraft(a, clients)),
					className: "flex min-h-11 items-center justify-between gap-3 rounded-xl border border-line bg-surface px-3 py-2 text-left",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block truncate font-medium",
							children: apptName(a, clients)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-sm text-muted",
							children: [
								formatShort(a.date),
								" · ",
								PAY_LABEL[a.payStatus]
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "shrink-0 tabular-nums",
						children: money(a.value)
					})]
				}, a.id))]
			})
		]
	});
}
function Slider({ label, value, min, max, step = 1, suffix = "", prefix = "", onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "grid gap-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "flex items-baseline justify-between text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "tabular-nums font-medium",
				children: [
					prefix,
					value,
					suffix
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "range",
			min,
			max,
			step,
			value,
			onChange: (e) => onChange(Number(e.target.value)),
			className: "accent-accent h-11 w-full"
		})]
	});
}
function MoreView() {
	const book = useBook();
	const fileRef = (0, import_react.useRef)(null);
	const [pending, setPending] = (0, import_react.useState)(null);
	const [armedReset, setArmedReset] = (0, import_react.useState)(false);
	const hasDemo = book.clients.some((c) => c.demo) || book.appointments.some((a) => a.demo);
	const stamp = todayISO();
	const onFile = async (file) => {
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl",
				children: "Mais"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted",
				children: "Tipos de atendimento, backup e o que fica no aparelho."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "grid gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl",
						children: "Estúdio"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Nome na capa",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
							value: book.settings.studioName,
							onChange: (e) => book.updateSettings({ studioName: e.target.value })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Como te chamar",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
							value: book.settings.practitioner,
							onChange: (e) => book.updateSettings({ practitioner: e.target.value })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Chave PIX",
						hint: "entra no lembrete",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
							value: book.settings.pixKey,
							placeholder: "celular, e-mail ou aleatória",
							onChange: (e) => book.updateSettings({ pixKey: e.target.value })
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "grid gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl",
							children: "Tipos de atendimento"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => book.addService(),
							children: "Adicionar"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Consulta de tarot, limpeza, trabalho — ou o que você quiser. Pode apagar e criar."
					}),
					book.services.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Nenhum tipo. O horário ainda aceita um nome livre."
					}) : null,
					book.services.map((service) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-2 rounded-lg bg-sunken p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
								value: service.name,
								"aria-label": "Nome do tipo",
								onChange: (e) => book.updateService(service.id, { name: e.target.value })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
									inputMode: "decimal",
									"aria-label": "Valor padrão",
									placeholder: "Valor",
									defaultValue: service.defaultPrice ?? "",
									onBlur: (e) => {
										book.updateService(service.id, { defaultPrice: parseMoney(e.target.value) });
									}
								}, `${service.id}-${service.defaultPrice ?? "v"}`), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
									inputMode: "numeric",
									"aria-label": "Duração em minutos",
									placeholder: "Minutos",
									defaultValue: service.durationMin ?? "",
									onBlur: (e) => {
										const raw = e.target.value.trim();
										const minutes = raw ? Number(raw) : null;
										book.updateService(service.id, { durationMin: minutes != null && !Number.isNaN(minutes) ? minutes : null });
									}
								}, `${service.id}-min-${service.durationMin ?? "m"}`)]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "danger",
								onClick: () => book.removeService(service.id),
								children: "Excluir tipo"
							})
						]
					}, service.id))
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "grid gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl",
						children: "Levar e trazer"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Tudo fica neste aparelho, neste navegador. Exporte um backup de vez em quando. Dá para importar contatos da agenda do celular (vCard ou CSV) e também o backup completo."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => downloadText(`janice-tarot-backup-${stamp}.json`, backupJson(book), "application/json"),
						children: "Exportar backup"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => downloadText(`contatos-${stamp}.csv`, clientsCsv(book), "text/csv"),
						children: "Exportar contatos"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => downloadText(`agenda-${stamp}.csv`, appointmentsCsv(book), "text/csv"),
						children: "Exportar agenda"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => fileRef.current?.click(),
						children: "Importar arquivo"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: fileRef,
						type: "file",
						accept: ".vcf,.vcard,.csv,.json,text/vcard,text/csv,application/json",
						className: "hidden",
						onChange: (e) => {
							const file = e.target.files?.[0];
							e.target.value = "";
							if (file) onFile(file);
						}
					}),
					pending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-2 rounded-lg border border-line p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm",
							children: [
								"Backup com ",
								pending.clients.length,
								" contatos e ",
								pending.appointments.length,
								" horários."
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "primary",
									onClick: () => {
										book.mergeBook(pending);
										setPending(null);
										toast.success("Backup juntado ao que já existe");
									},
									children: "Juntar"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									onClick: () => {
										book.replaceBook(pending);
										setPending(null);
										toast.success("Dados substituídos pelo backup");
									},
									children: "Substituir tudo"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									onClick: () => setPending(null),
									children: "Cancelar"
								})
							]
						})]
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "grid gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl",
						children: "Limpar"
					}),
					hasDemo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => {
							book.clearDemo();
							toast.success("Exemplos apagados");
						},
						children: "Apagar dados de exemplo"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Não há dados de exemplo."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "danger",
						onClick: () => {
							if (!armedReset) {
								setArmedReset(true);
								return;
							}
							book.resetAll();
							setArmedReset(false);
							toast.success("Agenda zerada");
						},
						children: armedReset ? "Confirmar: apagar tudo" : "Zerar agenda e contatos"
					})
				]
			})
		]
	});
}
var NAV = [
	{
		id: "hoje",
		label: "Hoje",
		icon: House
	},
	{
		id: "agenda",
		label: "Agenda",
		icon: CalendarDays
	},
	{
		id: "clientes",
		label: "Clientes",
		icon: Users
	},
	{
		id: "caixa",
		label: "Caixa",
		icon: Wallet
	},
	{
		id: "mais",
		label: "Mais",
		icon: SlidersHorizontal
	}
];
function JaniceApp() {
	const studioName = useBook((s) => s.settings.studioName);
	const clearDemo = useBook((s) => s.clearDemo);
	const hasDemo = useBook((s) => s.clients.some((c) => c.demo) || s.appointments.some((a) => a.demo));
	const [view, setView] = (0, import_react.useState)("hoje");
	const [menu, setMenu] = (0, import_react.useState)(false);
	const [appt, setAppt] = (0, import_react.useState)(null);
	const [client, setClient] = (0, import_react.useState)(null);
	(0, import_react.useLayoutEffect)(() => {
		useBook.getState().adoptStorage();
	}, []);
	const api = (0, import_react.useMemo)(() => ({
		openAppt: (draft) => {
			setClient(null);
			setMenu(false);
			setAppt(draft);
		},
		openClient: (draft) => {
			setAppt(null);
			setMenu(false);
			setClient(draft);
		},
		go: (next) => setView(next)
	}), []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StudioProvider, {
		value: api,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-h-dvh bg-bg text-fg md:flex",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
						className: "sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-line bg-surface md:flex",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 px-4 py-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid size-11 place-items-center rounded-xl bg-accent font-display text-xl text-accent-fg",
								children: "J"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-display text-lg leading-tight",
								children: studioName || "Janice Tarot"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted",
								children: "agenda e caixa"
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
							className: "grid gap-1 px-3",
							children: NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavButton, {
								item,
								active: view === item.id,
								onClick: () => setView(item.id)
							}, item.id))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1 pb-24 md:pb-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
							className: "sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-line bg-bg px-4 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate font-display text-xl",
									children: studioName || "Janice Tarot"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted",
									children: NAV.find((item) => item.id === view)?.label
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
									"aria-label": "Novo",
									onClick: () => setMenu((open) => !open),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-5" })
								}), menu ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "fixed inset-0 z-20 cursor-default",
									"aria-label": "Fechar",
									onClick: () => setMenu(false)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "absolute right-0 z-30 w-52 rounded-xl border border-line bg-surface p-2 shadow-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "h-11 w-full rounded-lg px-3 text-left text-sm hover:bg-sunken",
										onClick: () => api.openAppt(blankAppt({ date: todayISO() })),
										children: "Novo horário"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "h-11 w-full rounded-lg px-3 text-left text-sm hover:bg-sunken",
										onClick: () => api.openClient(blankClient()),
										children: "Novo contato"
									})]
								})] }) : null]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
							className: "mx-auto grid w-full max-w-3xl gap-4 px-4 py-5",
							children: [
								hasDemo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center justify-between gap-3 rounded-xl bg-sunken px-4 py-3 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Tem dados de exemplo para você ver a agenda funcionando. Apague quando for usar de verdade." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "h-11 shrink-0 rounded-lg bg-surface px-3 font-medium",
										onClick: () => clearDemo(),
										children: "Apagar exemplos"
									})]
								}) : null,
								view === "hoje" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TodayView, {}) : null,
								view === "agenda" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AgendaView, {}) : null,
								view === "clientes" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientsView, {}) : null,
								view === "caixa" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FinanceView, {}) : null,
								view === "mais" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoreView, {}) : null
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "fixed inset-x-0 bottom-0 z-20 grid grid-cols-5 border-t border-line bg-surface md:hidden",
						children: NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setView(item.id),
							className: "flex h-16 flex-col items-center justify-center gap-1 text-xs " + (view === item.id ? "text-accent" : "text-muted"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, {
								className: "size-5",
								strokeWidth: view === item.id ? 2.25 : 1.75
							}), item.label]
						}, item.id))
					})
				]
			}),
			appt ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApptForm, {
				draft: appt,
				onClose: () => setAppt(null)
			}, appt.id ?? "novo-horario") : null,
			client ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientForm, {
				draft: client,
				onClose: () => setClient(null),
				onBook: (prefill) => api.openAppt(blankAppt(prefill)),
				onOpenAppointment: (appointment) => {
					api.openAppt(apptToDraft(appointment, useBook.getState().clients));
				}
			}, client.id ?? "novo-contato") : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, { position: "top-center" })
		]
	});
}
function NavButton({ item, active, onClick }) {
	const Icon = item.icon;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: "flex h-11 items-center gap-3 rounded-lg px-3 text-left text-sm " + (active ? "bg-sunken font-medium text-accent" : "text-fg"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5" }), item.label]
	});
}
var SplitComponent = JaniceApp;
//#endregion
export { SplitComponent as component };
