import type { ReactNode } from "react";

export function AuthCard({
  title,
  lede,
  children,
  footer,
}: {
  title: string;
  lede: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-5 py-12">
      <section className="rounded-[28px] border border-line bg-card px-6 py-8 shadow-[var(--shadow)] sm:px-8">
        <div className="mb-8 h-1 w-12 rounded-full bg-accent" />
        <h1 className="font-display text-4xl leading-none tracking-tight text-ink">
          {title}
        </h1>
        <p className="mt-3 text-base leading-7 text-muted">{lede}</p>
        <div className="mt-8">{children}</div>
        <div className="mt-6 border-t border-line pt-5 text-sm text-muted">
          {footer}
        </div>
      </section>
    </main>
  );
}

export function FieldGroup({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <fieldset className="min-w-0 border-0 p-0">
      <legend className="mb-4 w-full text-xs font-semibold tracking-[0.18em] text-muted uppercase">
        {title}
      </legend>
      <div className="flex flex-col gap-5">{children}</div>
    </fieldset>
  );
}
