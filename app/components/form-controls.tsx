import type { ButtonHTMLAttributes, ReactNode } from "react";

export const controlClassName =
  "w-full rounded-lg border border-black/10 bg-transparent px-3 py-2.5 text-base transition-colors placeholder:text-zinc-500 focus:border-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 aria-invalid:border-red-600 dark:border-white/15 dark:placeholder:text-zinc-400 dark:focus:border-zinc-200 dark:aria-invalid:border-red-400";

export function FormField({
  label,
  htmlFor,
  required,
  error,
  errorId,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  errorId?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
        {required ? (
          <span className="font-normal text-zinc-500 dark:text-zinc-400">
            {" "}
            (required)
          </span>
        ) : null}
      </label>
      {children}
      {error ? (
        <p
          id={errorId}
          role="alert"
          className="text-sm text-red-600 dark:text-red-400"
        >
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
      className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200"
    >
      {children}
    </p>
  );
}

export function SubmitButton({
  children,
  disabled,
}: Pick<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "disabled">) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="h-12 w-full rounded-full bg-foreground px-5 text-base font-medium text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {children}
    </button>
  );
}

export const primaryLinkClassName =
  "inline-flex h-12 min-w-[10rem] items-center justify-center rounded-full bg-foreground px-6 text-base font-medium text-background transition-opacity hover:opacity-90";

export const secondaryLinkClassName =
  "inline-flex h-12 min-w-[10rem] items-center justify-center rounded-full border border-black/10 px-6 text-base font-medium transition-colors hover:bg-black/[.04] dark:border-white/15 dark:hover:bg-white/[.06]";
