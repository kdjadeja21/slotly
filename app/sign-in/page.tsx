import Link from "next/link";
import { AuthCard } from "@/app/components/auth-card";
import { SignInForm } from "@/app/sign-in/sign-in-form";

export default function SignInPage() {
  return (
    <AuthCard
      title="Sign in"
      lede="Welcome back. Enter your username and password."
      footer={
        <>
          New here?{" "}
          <Link href="/sign-up" className="font-medium text-ink underline">
            Sign up
          </Link>
        </>
      }
    >
      <SignInForm />
    </AuthCard>
  );
}
