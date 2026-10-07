import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "soft" | "ghost" | "danger";
};

export function Button({ variant = "soft", className, type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(
        "inline-flex h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-opacity disabled:opacity-50",
        variant === "primary" && "bg-accent text-accent-fg",
        variant === "soft" && "bg-sunken text-fg",
        variant === "ghost" && "bg-transparent text-fg",
        variant === "danger" && "bg-transparent text-accent",
        className,
      )}
      {...props}
    />
  );
}

export function IconButton({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cx(
        "inline-flex size-11 items-center justify-center rounded-lg text-fg hover:bg-sunken",
        className,
      )}
      {...props}
    />
  );
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div>
      <span className="mb-1.5 flex items-baseline justify-between gap-3 text-sm text-muted">
        <span>{label}</span>
        {hint ? <span className="text-xs">{hint}</span> : null}
      </span>
      {children}
    </div>
  );
}

export const controlClass =
  "h-11 w-full rounded-lg border border-line bg-surface px-3 text-fg outline-none placeholder:text-muted focus:border-accent";

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cx(controlClass, props.className)} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cx(
        "min-h-24 w-full rounded-lg border border-line bg-surface px-3 py-2 text-fg outline-none placeholder:text-muted focus:border-accent",
        props.className,
      )}
    />
  );
}

export function Choice({
  on,
  children,
  onClick,
}: {
  on: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={cx(
        "h-11 rounded-full border px-3 text-sm",
        on ? "border-accent bg-accent text-accent-fg" : "border-line bg-surface text-fg",
      )}
    >
      {children}
    </button>
  );
}

export function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;
  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto bg-fg/40">
      <div className="flex min-h-dvh items-start justify-center sm:items-center sm:p-6">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="sheet-title"
          className="w-full border border-line bg-surface p-5 shadow-sm sm:my-6 sm:max-w-lg sm:rounded-xl"
        >
          <div className="mb-4 flex items-start justify-between gap-3">
            <h2 id="sheet-title" className="font-display text-2xl leading-tight text-fg">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              className="inline-flex size-11 items-center justify-center rounded-lg hover:bg-sunken"
            >
              <X className="size-5" />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <section className={cx("rounded-xl border border-line bg-surface p-4", className)}>{children}</section>;
}

export function PayPill({ label, tone }: { label: string; tone: "pago" | "pendente" | "nao_pago" | "combinado" }) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center rounded-full px-2.5 text-xs font-medium",
        tone === "pago" && "bg-accent text-accent-fg",
        tone === "pendente" && "bg-sunken text-fg",
        tone === "nao_pago" && "border border-line text-muted",
        tone === "combinado" && "border border-accent text-accent",
      )}
    >
      {label}
    </span>
  );
}
