import Link from "next/link";
import { signOut } from "@/app/actions/auth";
import { getCurrentUser } from "@/lib/current-user";

export async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-10 border-b border-line/80 bg-paper/80 backdrop-blur-md">
      <nav className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-5 py-3">
        <Link
          href="/"
          className="font-display text-2xl tracking-tight text-ink"
        >
          Slotly
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <>
              <Link
                href={`/${encodeURIComponent(user.username)}`}
                className="inline-flex h-11 items-center rounded-full px-3 text-sm font-medium text-ink hover:bg-card"
              >
                {user.username}
              </Link>
              <form action={signOut}>
                <button
                  type="submit"
                  className="inline-flex h-11 items-center rounded-full border border-line bg-card px-4 text-sm font-medium text-ink transition hover:border-accent/40"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="inline-flex h-11 items-center rounded-full px-3 text-sm font-medium text-ink hover:bg-card"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="inline-flex h-11 items-center rounded-full bg-accent px-4 text-sm font-medium text-accent-ink hover:brightness-110"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
