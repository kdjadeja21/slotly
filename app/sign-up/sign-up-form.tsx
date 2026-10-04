"use client";

import { useActionState, useRef } from "react";
import {
  PictureField,
  type PictureFieldHandle,
} from "@/app/components/picture-field";
import { TimezoneSelect } from "@/app/components/timezone-select";
import {
  controlClassName,
  FormAlert,
  FormField,
  SubmitButton,
} from "@/app/components/form-controls";
import { signUp, type AuthFormState } from "@/app/actions/auth";

const initialState: AuthFormState = {};

export function SignUpForm() {
  const pictureFieldRef = useRef<PictureFieldHandle>(null);
  const [state, formAction, pending] = useActionState(signUp, initialState);
  const usernameError =
    state.errorField === "username" && state.error ? state.error : undefined;
  const formError = state.errorField === "username" ? undefined : state.error;
  const usernameForAvatar = state.username ?? "";

  return (
    <form
      action={formAction}
      className="flex flex-col gap-5"
      encType="multipart/form-data"
      onSubmit={() => {
        pictureFieldRef.current?.syncFileInput();
      }}
    >
      <FormField
        label="Username"
        htmlFor="signup-username"
        required
        error={usernameError}
        errorId="signup-username-error"
      >
        <input
          id="signup-username"
          name="username"
          autoComplete="username"
          required
          defaultValue={state.username}
          aria-invalid={usernameError ? true : undefined}
          aria-describedby={usernameError ? "signup-username-error" : undefined}
          className={controlClassName}
        />
      </FormField>
      <FormField label="Password" htmlFor="signup-password" required>
        <input
          id="signup-password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          className={controlClassName}
        />
      </FormField>
      <FormField label="Name" htmlFor="signup-name">
        <input
          id="signup-name"
          name="name"
          autoComplete="name"
          defaultValue={state.name}
          className={controlClassName}
        />
      </FormField>
      <FormField label="Profile picture" htmlFor="signup-picture">
        <PictureField
          ref={pictureFieldRef}
          inputId="signup-picture"
          displayName={state.name ?? ""}
          username={usernameForAvatar}
        />
      </FormField>
      <FormField label="Bio" htmlFor="signup-bio">
        <textarea
          id="signup-bio"
          name="bio"
          rows={4}
          defaultValue={state.bio}
          className={controlClassName}
        />
      </FormField>
      <FormField label="Timezone" htmlFor="signup-timezone">
        <TimezoneSelect
          id="signup-timezone"
          defaultValue={state.timezone ?? ""}
        />
      </FormField>
      {formError ? <FormAlert>{formError}</FormAlert> : null}
      <SubmitButton disabled={pending}>Sign up</SubmitButton>
    </form>
  );
}
