"use client";

import { useActionState } from "react";
import {
  controlClassName,
  FormAlert,
  FormField,
  SubmitButton,
} from "@/app/components/form-controls";
import { signIn, type AuthFormState } from "@/app/actions/auth";

const initialState: AuthFormState = {};

export function SignInForm() {
  const [state, formAction, pending] = useActionState(signIn, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <FormField label="Username" htmlFor="signin-username" required>
        <input
          id="signin-username"
          name="username"
          autoComplete="username"
          required
          defaultValue={state.username}
          className={controlClassName}
        />
      </FormField>
      <FormField label="Password" htmlFor="signin-password" required>
        <input
          id="signin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={controlClassName}
        />
      </FormField>
      {state.error ? <FormAlert>{state.error}</FormAlert> : null}
      <SubmitButton disabled={pending}>Sign in</SubmitButton>
    </form>
  );
}
