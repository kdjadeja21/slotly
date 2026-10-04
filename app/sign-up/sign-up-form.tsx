"use client";

import { useActionState } from "react";
import { signUp, type AuthFormState } from "@/app/actions/auth";

const initialState: AuthFormState = {};

export function SignUpForm() {
  const [state, formAction, pending] = useActionState(signUp, initialState);
  const usernameError =
    state.errorField === "username" && state.error ? state.error : undefined;
  const formError = state.errorField === "username" ? undefined : state.error;

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1" htmlFor="signup-username">
        Username
        <input
          id="signup-username"
          name="username"
          autoComplete="username"
          required
          defaultValue={state.username}
          aria-invalid={usernameError ? true : undefined}
          aria-describedby={usernameError ? "signup-username-error" : undefined}
          className="rounded border border-black/10 bg-transparent px-3 py-2 aria-invalid:border-red-600 dark:border-white/15 dark:aria-invalid:border-red-400"
        />
        {usernameError ? (
          <p
            id="signup-username-error"
            role="alert"
            className="text-sm text-red-600 dark:text-red-400"
          >
            {usernameError}
          </p>
        ) : null}
      </label>
      <label className="flex flex-col gap-1" htmlFor="signup-password">
        Password
        <input
          id="signup-password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          className="rounded border border-black/10 bg-transparent px-3 py-2 dark:border-white/15"
        />
      </label>
      <label className="flex flex-col gap-1" htmlFor="signup-name">
        Name
        <input
          id="signup-name"
          name="name"
          autoComplete="name"
          defaultValue={state.name}
          className="rounded border border-black/10 bg-transparent px-3 py-2 dark:border-white/15"
        />
      </label>
      <label className="flex flex-col gap-1" htmlFor="signup-picture">
        Profile picture
        <input
          id="signup-picture"
          name="picture"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
        />
      </label>
      <label className="flex flex-col gap-1" htmlFor="signup-bio">
        Bio
        <textarea
          id="signup-bio"
          name="bio"
          rows={4}
          defaultValue={state.bio}
          className="rounded border border-black/10 bg-transparent px-3 py-2 dark:border-white/15"
        />
      </label>
      <label className="flex flex-col gap-1" htmlFor="signup-timezone">
        Timezone
        <input
          id="signup-timezone"
          name="timezone"
          defaultValue={state.timezone}
          className="rounded border border-black/10 bg-transparent px-3 py-2 dark:border-white/15"
        />
      </label>
      {formError ? <p role="alert">{formError}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="h-12 rounded-full bg-foreground px-5 text-background disabled:opacity-60"
      >
        Sign up
      </button>
    </form>
  );
}
