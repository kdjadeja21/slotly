import Link from "next/link";

export default function ProfileNotFound() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-5 py-20 text-center">
      <h1 className="font-display text-4xl tracking-tight text-ink">
        Profile not found
      </h1>
      <p className="mt-3 text-base leading-7 text-muted">
        That username does not have a public profile.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex h-12 items-center rounded-2xl bg-accent px-6 font-medium text-accent-ink"
      >
        Back home
      </Link>
    </main>
  );
}
