import Link from "next/link";

const focusClassName =
  "focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2";

const entryLinkClassName = `inline-flex min-h-11 items-center px-3 text-sm font-medium transition-colors hover:text-foreground/70 ${focusClassName}`;

export function Header() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex w-full min-w-0 max-w-5xl items-center justify-between gap-4 px-6">
        <Link
          href="/"
          className={`inline-flex min-h-11 items-center font-semibold tracking-tight ${focusClassName}`}
        >
          Slotly
        </Link>
        <nav className="flex items-center">
          <Link href="/sign-in" className={entryLinkClassName}>
            Sign in
          </Link>
          <Link href="/sign-up" className={entryLinkClassName}>
            Sign up
          </Link>
        </nav>
      </div>
    </header>
  );
}
