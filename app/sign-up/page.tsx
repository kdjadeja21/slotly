import Link from "next/link";
import { SignUpForm } from "@/app/sign-up/sign-up-form";

export default function SignUpPage() {
  return (
    <main className="mx-auto flex w-full max-w-lg flex-col gap-6 px-6 py-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Sign up</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Create your Slotly profile and choose a unique username.
        </p>
      </div>
      <SignUpForm />
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-medium text-foreground underline">
          Sign in
        </Link>
      </p>
    </main>
  );
}
