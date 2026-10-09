"use client";

import { useActionState } from "react";
import { signIn, type AuthFormState } from "@/app/actions/auth";
import {
  controlClassName,
  FormField,
  SubmitButton,
} from "@/app/components/form-controls";

const initialState: AuthFormState = {};

export function SignInForm() {
  const [state, formAction, pending] = useActionState(signIn, initialState);
  const usernameError = state.errorField === "username" ? state.error : undefined;
  const passwordError = state.errorField === "password" ? state.error : undefined;

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <FormField
        label="Username"
        htmlFor="signin-username"
        required
        error={usernameError}
        errorId="signin-username-error"
      >
        <input
          id="signin-username"
          name="username"
          autoComplete="username"
          required
          defaultValue={state.username}
          aria-invalid={usernameError ? true : undefined}
          aria-describedby={usernameError ? "signin-username-error" : undefined}
          className={controlClassName}
        />
      </FormField>
      <FormField
        label="Password"
        htmlFor="signin-password"
        required
        error={passwordError}
        errorId="signin-password-error"
      >
        <input
          id="signin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-invalid={passwordError ? true : undefined}
          aria-describedby={passwordError ? "signin-password-error" : undefined}
          className={controlClassName}
        />
      </FormField>
      <SubmitButton disabled={pending} pendingLabel="Signing in…">
        Sign in
      </SubmitButton>
    </form>
  );
}
