import type { ButtonHTMLAttributes, ReactNode } from "react";

const fieldClassName =
  "w-full rounded-2xl border border-line bg-paper px-4 text-base text-ink outline-none transition placeholder:text-muted focus:border-accent focus:ring-4 focus:ring-accent/20 aria-invalid:border-danger aria-invalid:ring-danger/15";

export const controlClassName = `h-12 ${fieldClassName}`;

export const textareaClassName = `min-h-32 py-3 ${fieldClassName}`;

export function FormField({
  label,
  htmlFor,
  required,
  hint,
  error,
  errorId,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  hint?: string;
  error?: string;
  errorId?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
          {label}
        </label>
        {required ? (
          <span className="text-xs tracking-wide text-muted">Required</span>
        ) : null}
      </div>
      {children}
      {hint && !error ? <p className="text-sm text-muted">{hint}</p> : null}
      {error ? (
        <p id={errorId} role="alert" className="text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function FormAlert({ children }: { children: ReactNode }) {
  return (
    <p
      role="alert"
      className="rounded-2xl border border-danger/30 bg-danger-bg px-4 py-3 text-sm text-danger"
    >
      {children}
    </p>
  );
}

export function SubmitButton({
  children,
  pendingLabel,
  disabled,
}: Pick<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "disabled"> & {
  pendingLabel: string;
}) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="h-12 w-full rounded-2xl bg-accent px-5 text-base font-medium text-accent-ink transition hover:brightness-110 disabled:cursor-wait disabled:opacity-70"
    >
      {disabled ? pendingLabel : children}
    </button>
  );
}

export const primaryLinkClassName =
  "inline-flex h-12 min-w-40 items-center justify-center rounded-2xl bg-accent px-6 text-base font-medium text-accent-ink transition hover:brightness-110";

export const secondaryLinkClassName =
  "inline-flex h-12 min-w-40 items-center justify-center rounded-2xl border border-line bg-card px-6 text-base font-medium text-ink transition hover:border-accent/40";
