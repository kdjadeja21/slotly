import Link from "next/link";
import {
  primaryLinkClassName,
  secondaryLinkClassName,
} from "@/app/components/form-controls";
import { getCurrentUser } from "@/lib/current-user";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center gap-8 px-6 py-16 text-center">
      <h1 className="text-4xl font-semibold tracking-tight">Slotly</h1>
      {user ? (
        <Link
          href={`/${encodeURIComponent(user.username)}`}
          className={primaryLinkClassName}
        >
          Your profile
        </Link>
      ) : (
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-center">
          <Link href="/sign-in" className={primaryLinkClassName}>
            Sign in
          </Link>
          <Link href="/sign-up" className={secondaryLinkClassName}>
            Sign up
          </Link>
        </div>
      )}
    </main>
  );
}
