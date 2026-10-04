import Link from "next/link";
import { signOut } from "@/app/actions/auth";
import { getCurrentUser } from "@/lib/current-user";

export async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="border-b border-black/10 dark:border-white/15">
      <nav className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-6 py-4 text-sm">
        <Link
          href="/"
          className="font-semibold tracking-tight text-foreground hover:opacity-80"
        >
          Slotly
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                href={`/${encodeURIComponent(user.username)}`}
                className="font-medium hover:underline"
              >
                {user.username}
              </Link>
              <form action={signOut}>
                <button
                  type="submit"
                  className="rounded-full border border-black/10 px-3 py-1.5 font-medium transition-colors hover:bg-black/[.04] dark:border-white/15 dark:hover:bg-white/[.06]"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/sign-in" className="font-medium hover:underline">
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="rounded-full bg-foreground px-3 py-1.5 font-medium text-background hover:opacity-90"
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
