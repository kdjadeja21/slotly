import Link from "next/link";
import { SignUpForm } from "@/app/sign-up/sign-up-form";

export default function SignUpPage() {
  return (
    <main className="mx-auto flex w-full max-w-lg flex-col gap-6 px-6 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Sign up</h1>
      <SignUpForm />
      <Link href="/sign-in">Sign in</Link>
    </main>
  );
}
