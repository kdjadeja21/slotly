import Link from "next/link";
import { AuthCard } from "@/app/components/auth-card";
import { SignUpForm } from "@/app/sign-up/sign-up-form";
import { timezoneGroups } from "@/lib/timezones";

export default function SignUpPage() {
  return (
    <AuthCard
      title="Sign up"
      lede="Create your Slotly profile and choose a unique username."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/sign-in" className="font-medium text-ink underline">
            Sign in
          </Link>
        </>
      }
    >
      <SignUpForm groups={timezoneGroups()} />
    </AuthCard>
  );
}
