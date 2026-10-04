"use client";

import { useActionState } from "react";
import { signIn, type AuthFormState } from "@/app/actions/auth";

const initialState: AuthFormState = {};

export function SignInForm() {
  const [state, formAction, pending] = useActionState(signIn, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1" htmlFor="signin-username">
        Username
        <input
          id="signin-username"
          name="username"
          autoComplete="username"
          required
          defaultValue={state.username}
          className="rounded border border-black/10 bg-transparent px-3 py-2 dark:border-white/15"
        />
      </label>
      <label className="flex flex-col gap-1" htmlFor="signin-password">
        Password
        <input
          id="signin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="rounded border border-black/10 bg-transparent px-3 py-2 dark:border-white/15"
        />
      </label>
      {state.error ? <p role="alert">{state.error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="h-12 rounded-full bg-foreground px-5 text-background disabled:opacity-60"
      >
        Sign in
      </button>
    </form>
  );
}
