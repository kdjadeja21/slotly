import Link from "next/link";
import {
  primaryLinkClassName,
  secondaryLinkClassName,
} from "@/app/components/form-controls";
import { getCurrentUser } from "@/lib/current-user";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-5 py-20 text-center">
      <p className="text-xs font-semibold tracking-[0.22em] text-muted uppercase">
        Slotly
      </p>
      <h1 className="mt-4 font-display text-5xl tracking-tight text-ink sm:text-6xl">
        Your public profile
      </h1>
      <p className="mt-4 max-w-md text-lg leading-8 text-muted">
        {user
          ? "Open the profile people see at your username."
          : "Sign up with a unique username, then share your profile link."}
      </p>
      <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        {user ? (
          <Link
            href={`/${encodeURIComponent(user.username)}`}
            className={primaryLinkClassName}
          >
            Your profile
          </Link>
        ) : (
          <>
            <Link href="/sign-in" className={primaryLinkClassName}>
              Sign in
            </Link>
            <Link href="/sign-up" className={secondaryLinkClassName}>
              Sign up
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
