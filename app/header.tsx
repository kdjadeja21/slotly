import Link from "next/link";
import { signOut } from "@/app/actions/auth";
import { getCurrentUser } from "@/lib/current-user";

const headerLinkClassName =
  "inline-flex min-h-11 items-center font-medium text-foreground hover:text-accent";

const headerButtonClassName =
  "inline-flex min-h-11 items-center rounded-full bg-accent px-4 text-sm font-semibold text-on-accent hover:bg-accent-strong";

export async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="border-b border-line bg-background text-foreground">
      <nav className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-5 py-2.5 text-sm">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-foreground hover:text-accent"
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
