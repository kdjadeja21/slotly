import Link from "next/link";
import { SignInForm } from "@/app/sign-in/sign-in-form";

export default function SignInPage() {
  return (
    <main className="mx-auto flex w-full max-w-lg flex-col gap-6 px-6 py-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Sign in</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Welcome back. Enter your username and password.
        </p>
      </div>
      <SignInForm />
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        New here?{" "}
        <Link href="/sign-up" className="font-medium text-foreground underline">
          Sign up
        </Link>
      </p>
    </main>
  );
}
