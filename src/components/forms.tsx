import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  PAY_LABEL,
  VISIT_LABEL,
  chargeMessage,
  clientById,
  formatShort,
  money,
  norm,
  parseMoney,
  statsFor,
  useBook,
  waLink,
  type ApptDraft,
  type Appointment,
  type Client,
  type ClientDraft,
  type PayStatus,
  type VisitStatus,
} from "@/lib/book";
import { Button, Choice, Field, Modal, TextArea, TextInput } from "@/components/ui";

const PAYS: PayStatus[] = ["pago", "pendente", "nao_pago", "combinado"];
const VISITS: VisitStatus[] = ["agendado", "realizado", "faltou", "cancelado"];

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("Lembrete copiado");
  } catch {
    toast.error("Não consegui copiar");
  }
}

export function ApptForm({ draft, onClose }: { draft: ApptDraft; onClose: () => void }) {
  const clients = useBook((s) => s.clients);
  const services = useBook((s) => s.services);
  const settings = useBook((s) => s.settings);
  const saveAppointment = useBook((s) => s.saveAppointment);
  const removeAppointment = useBook((s) => s.removeAppointment);
  const [form, setForm] = useState(draft);
  const [armed, setArmed] = useState(false);
  const patch = (partial: Partial<ApptDraft>) => setForm((current) => ({ ...current, ...partial }));

  const suggestions = useMemo(() => {
    const q = norm(form.guestName);
    if (!q) return [];
    return clients.filter((c) => norm(c.name).includes(q) || norm(c.phone).includes(q)).slice(0, 4);
  }, [clients, form.guestName]);

  const pickClient = (c: Client) => {
    patch({ clientId: c.id, guestName: c.name, phone: c.phone, saveContact: false });
  };

  const pickService = (id: string) => {
    if (form.serviceId === id) {
      patch({ serviceId: "" });
      return;
    }
    const service = services.find((s) => s.id === id);
    if (!service) return;
    patch({
      serviceId: service.id,
      serviceName: service.name,
      value: form.value.trim()
        ? form.value
        : service.defaultPrice != null
          ? String(service.defaultPrice).replace(".", ",")
          : "",
    });
  };

  const linked = clientById(clients, form.clientId || null);
  const showSaveContact =
    !form.clientId && form.guestName.trim().length > 0 && !clients.some((c) => norm(c.name) === norm(form.guestName));

  const message = chargeMessage({
    name: form.guestName,
    serviceName: form.serviceName,
    value: parseMoney(form.value),
    date: form.date,
    payDueDate: form.payDueDate,
    pixKey: settings.pixKey,
  });
  const whatsapp = waLink(form.phone || linked?.phone || "", message);

  return (
    <Modal open title={form.id ? "Editar horário" : "Novo horário"} onClose={onClose}>
      <form
        className="grid gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          saveAppointment(form);
          toast.success(form.id ? "Horário atualizado" : "Horário guardado");
          onClose();
        }}
      >
        <p className="text-sm text-muted">Nada é obrigatório. Preencha só o que souber.</p>
        <Field label="Nome">
          <TextInput
            value={form.guestName}
            placeholder="Quem vem"
            autoComplete="off"
            onChange={(e) => patch({ guestName: e.target.value, clientId: "" })}
          />
        </Field>
        {suggestions.length > 0 && !form.clientId ? (
          <div className="grid gap-1">
            {suggestions.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => pickClient(c)}
                className="flex h-11 items-center justify-between gap-3 rounded-lg bg-sunken px-3 text-left text-sm"
              >
                <span className="truncate">{c.name || "Sem nome"}</span>
                <span className="shrink-0 text-muted">{c.phone}</span>
              </button>
            ))}
          </div>
        ) : null}
        <div className="grid grid-cols-2 gap-3">
          <Field label="Dia">
            <TextInput type="date" value={form.date} onChange={(e) => patch({ date: e.target.value })} />
          </Field>
          <Field label="Horário">
            <TextInput type="time" value={form.time} onChange={(e) => patch({ time: e.target.value })} />
          </Field>
        </div>
        {services.length > 0 ? (
          <Field label="Tipo de atendimento">
            <div className="flex flex-wrap gap-2">
              {services.map((s) => (
                <Choice key={s.id} on={form.serviceId === s.id} onClick={() => pickService(s.id)}>
                  {s.name}
                </Choice>
              ))}
            </div>
          </Field>
        ) : null}
        <Field label="Descrição" hint="se quiser outro nome">
          <TextInput
            value={form.serviceName}
            placeholder="Consulta, limpeza, outro"
            onChange={(e) => {
              const serviceName = e.target.value;
              const selected = services.find((s) => s.id === form.serviceId);
              patch({
                serviceName,
                serviceId: selected && selected.name !== serviceName ? "" : form.serviceId,
              });
            }}
          />
        </Field>
        <Field label="Valor" hint="R$">
          <TextInput
            inputMode="decimal"
            placeholder="0"
            value={form.value}
            onChange={(e) => patch({ value: e.target.value })}
          />
        </Field>
        <Field label="Pagamento">
          <div className="flex flex-wrap gap-2">
            {PAYS.map((status) => (
              <Choice key={status} on={form.payStatus === status} onClick={() => patch({ payStatus: status })}>
                {PAY_LABEL[status]}
              </Choice>
            ))}
          </div>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Vai pagar em">
            <TextInput type="date" value={form.payDueDate} onChange={(e) => patch({ payDueDate: e.target.value })} />
          </Field>
          <Field label="Lembrar em">
            <TextInput
              type="date"
              value={form.reminderDate}
              onChange={(e) => patch({ reminderDate: e.target.value })}
            />
          </Field>
        </div>
        <Field label="Nota do lembrete">
          <TextInput
            value={form.reminderNote}
            placeholder="Cobrar no PIX depois do atendimento"
            onChange={(e) => patch({ reminderNote: e.target.value })}
          />
        </Field>
        <Field label="Comparecimento">
          <div className="flex flex-wrap gap-2">
            {VISITS.map((status) => (
              <Choice
                key={status}
                on={form.visitStatus === status}
                onClick={() => patch({ visitStatus: form.visitStatus === status ? "" : status })}
              >
                {VISIT_LABEL[status]}
              </Choice>
            ))}
          </div>
        </Field>
        <Field label="Telefone">
          <TextInput
            value={form.phone}
            inputMode="tel"
            placeholder="(19) 90000-0000"
            onChange={(e) => patch({ phone: e.target.value })}
          />
        </Field>
        {showSaveContact ? (
          <label className="flex min-h-11 items-center gap-3 text-sm">
            <input
              type="checkbox"
              className="size-5 accent-accent"
              checked={form.saveContact}
              onChange={(e) => patch({ saveContact: e.target.checked })}
            />
            Guardar também na lista de contatos
          </label>
        ) : null}
        <Field label="Observação">
          <TextArea
            value={form.notes}
            placeholder="O que ficou combinado"
            onChange={(e) => patch({ notes: e.target.value })}
          />
        </Field>
        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" onClick={() => void copyText(message)}>
            Copiar lembrete
          </Button>
          {whatsapp ? (
            <a
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center rounded-lg bg-sunken px-4 text-sm font-medium"
            >
              WhatsApp
            </a>
          ) : null}
        </div>
        <Button variant="primary" type="submit" className="w-full">
          Salvar
        </Button>
        {form.id ? (
          <Button
            variant="danger"
            className="w-full"
            onClick={() => {
              if (!armed) {
                setArmed(true);
                return;
              }
              removeAppointment(form.id ?? "");
              toast.success("Horário apagado");
              onClose();
            }}
          >
            {armed ? "Confirmar exclusão" : "Excluir horário"}
          </Button>
        ) : null}
      </form>
    </Modal>
  );
}

export function ClientForm({
  draft,
  onClose,
  onBook,
  onOpenAppointment,
}: {
  draft: ClientDraft;
  onClose: () => void;
  onBook: (prefill: Partial<ApptDraft>) => void;
  onOpenAppointment: (appointment: Appointment) => void;
}) {
  const appointments = useBook((s) => s.appointments);
  const settings = useBook((s) => s.settings);
  const saveClient = useBook((s) => s.saveClient);
  const removeClient = useBook((s) => s.removeClient);
  const [form, setForm] = useState(draft);
  const [armed, setArmed] = useState(false);
  const patch = (partial: Partial<ClientDraft>) => setForm((current) => ({ ...current, ...partial }));
  const stats = form.id ? statsFor(form.id, appointments) : null;
  const openValue = stats && stats.open > 0 ? stats.open : null;
  const whatsapp = waLink(
    form.phone,
    chargeMessage({
      name: form.name,
      serviceName: "atendimento",
      value: openValue,
      date: "",
      payDueDate: "",
      pixKey: settings.pixKey,
    }),
  );

  return (
    <Modal open title={form.id ? form.name || "Contato" : "Novo contato"} onClose={onClose}>
      <form
        className="grid gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          const id = saveClient(form);
          setForm((current) => ({ ...current, id }));
          toast.success("Contato salvo");
        }}
      >
        <Field label="Nome">
          <TextInput value={form.name} placeholder="Nome" onChange={(e) => patch({ name: e.target.value })} />
        </Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Telefone">
            <TextInput
              inputMode="tel"
              value={form.phone}
              placeholder="WhatsApp"
              onChange={(e) => patch({ phone: e.target.value })}
            />
          </Field>
          <Field label="E-mail">
            <TextInput
              inputMode="email"
              value={form.email}
              placeholder="opcional"
              onChange={(e) => patch({ email: e.target.value })}
            />
          </Field>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Aniversário">
            <TextInput type="date" value={form.birthday} onChange={(e) => patch({ birthday: e.target.value })} />
          </Field>
          <Field label="Como chegou">
            <TextInput
              value={form.source}
              placeholder="Indicação, Instagram"
              onChange={(e) => patch({ source: e.target.value })}
            />
          </Field>
        </div>
        <Field label="Observações">
          <TextArea value={form.notes} onChange={(e) => patch({ notes: e.target.value })} />
        </Field>
        {stats ? (
          <div className="grid grid-cols-2 gap-2">
            <Stat label="Marcou" value={String(stats.booked)} />
            <Stat label="Veio" value={String(stats.came)} />
            <Stat label="Última vez" value={stats.lastCame ? formatShort(stats.lastCame) : "ainda não"} />
            <Stat label="Faltou" value={String(stats.missed)} />
            <Stat label="Cobrado" value={money(stats.charged)} />
            <Stat label="Recebido" value={money(stats.received)} />
            <div className="col-span-2">
              <Stat label="Em aberto" value={money(stats.open)} />
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted">Salve o contato para começar o histórico.</p>
        )}
        {stats && stats.history.length > 0 ? (
          <div className="grid gap-2">
            <p className="text-sm text-muted">Histórico</p>
            {stats.history.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => onOpenAppointment(a)}
                className="flex min-h-11 items-center justify-between gap-3 rounded-lg bg-sunken px-3 py-2 text-left text-sm"
              >
                <span className="min-w-0">
                  <span className="block truncate font-medium">{a.serviceName || "Atendimento"}</span>
                  <span className="text-muted">{[a.date ? formatShort(a.date) : "Sem data", a.time].filter(Boolean).join(" · ")}</span>
                </span>
                <span className="shrink-0 tabular-nums">{money(a.value)}</span>
              </button>
            ))}
          </div>
        ) : null}
        <div className="flex flex-wrap gap-2">
          <Button variant="primary" type="submit">
            Salvar contato
          </Button>
          <Button
            onClick={() => {
              const id = saveClient(form);
              setForm((current) => ({ ...current, id }));
              onBook({
                clientId: id,
                guestName: form.name,
                phone: form.phone,
                saveContact: false,
              });
            }}
          >
            Marcar horário
          </Button>
          {whatsapp ? (
            <a
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center rounded-lg bg-sunken px-4 text-sm font-medium"
            >
              WhatsApp
            </a>
          ) : null}
        </div>
        {form.id ? (
          <Button
            variant="danger"
            onClick={() => {
              if (!armed) {
                setArmed(true);
                return;
              }
              removeClient(form.id ?? "");
              toast.success("Contato apagado");
              onClose();
            }}
          >
            {armed ? "Confirmar exclusão" : "Excluir contato"}
          </Button>
        ) : null}
      </form>
    </Modal>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-sunken px-3 py-2">
      <p className="text-xs text-muted">{label}</p>
      <p className="font-medium tabular-nums">{value}</p>
    </div>
  );
}
