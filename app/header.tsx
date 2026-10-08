import Link from "next/link";
import { signOut } from "@/app/actions/auth";
import { getCurrentUser } from "@/lib/current-user";

const headerLinkClassName =
  "inline-flex min-h-11 items-center font-medium text-cream hover:text-ticket";

const headerButtonClassName =
  "inline-flex min-h-11 items-center bg-ticket px-4 font-display text-sm uppercase tracking-wide text-ink hover:bg-cream";

export async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="border-b border-dashed border-cream/35 bg-counter text-cream">
      <nav className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-5 py-2.5 text-sm">
        <Link
          href="/"
          className="font-display text-[1.7rem] leading-none tracking-[-0.02em] text-cream hover:text-ticket"
        >
          Slotly
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          {user ? (
            <>
              <Link
                href={`/${encodeURIComponent(user.username)}`}
                className={`${headerLinkClassName} max-w-[38vw] truncate sm:max-w-[16rem]`}
              >
                {user.username}
              </Link>
              <form action={signOut}>
                <button type="submit" className={headerButtonClassName}>
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/sign-in" className={headerLinkClassName}>
                Sign in
              </Link>
              <Link href="/sign-up" className={headerButtonClassName}>
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
