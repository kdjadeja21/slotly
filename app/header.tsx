import Link from "next/link";
import { signOut } from "@/app/actions/auth";
import { getCurrentUser } from "@/lib/current-user";

export async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="border-b border-black/10 dark:border-white/15">
      <nav className="mx-auto flex w-full max-w-3xl items-center justify-end gap-4 px-6 py-4 text-sm">
        {user ? (
          <>
            <Link href={`/${encodeURIComponent(user.username)}`}>
              {user.username}
            </Link>
            <form action={signOut}>
              <button type="submit">Sign out</button>
            </form>
          </>
        ) : (
          <>
            <Link href="/sign-in">Sign in</Link>
            <Link href="/sign-up">Sign up</Link>
          </>
        )}
      </nav>
    </header>
  );
}
