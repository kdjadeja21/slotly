import Link from "next/link";
import { SignInForm } from "@/app/sign-in/sign-in-form";

export default function SignInPage() {
  return (
    <main className="mx-auto flex w-full max-w-lg flex-col gap-6 px-6 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Sign in</h1>
      <SignInForm />
      <Link href="/sign-up">Sign up</Link>
    </main>
  );
}
