"use client";

import { useActionState, useRef } from "react";
import { signUp, type AuthFormState } from "@/app/actions/auth";
import { FieldGroup } from "@/app/components/auth-card";
import {
  controlClassName,
  FormField,
  SubmitButton,
  textareaClassName,
} from "@/app/components/form-controls";
import {
  PictureField,
  type PictureFieldHandle,
} from "@/app/components/picture-field";
import {
  TimezoneSelect,
  type TimezoneGroup,
} from "@/app/components/timezone-select";

const initialState: AuthFormState = {};

export function SignUpForm({ groups }: { groups: TimezoneGroup[] }) {
  const pictureFieldRef = useRef<PictureFieldHandle>(null);
  const [state, formAction, pending] = useActionState(signUp, initialState);
  const usernameError = state.errorField === "username" ? state.error : undefined;
  const passwordError = state.errorField === "password" ? state.error : undefined;
  const pictureError = state.errorField === "picture" ? state.error : undefined;
  const timezoneError = state.errorField === "timezone" ? state.error : undefined;

  return (
    <form
      action={formAction}
      className="flex flex-col gap-8"
      onSubmit={() => {
        pictureFieldRef.current?.syncFileInput();
      }}
    >
      <FieldGroup title="Account">
        <FormField
          label="Username"
          htmlFor="signup-username"
          required
          error={usernameError}
          errorId="signup-username-error"
          hint="This becomes your public link."
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
        <FormField
          label="Password"
          htmlFor="signup-password"
          required
          error={passwordError}
          errorId="signup-password-error"
        >
          <input
            id="signup-password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            aria-invalid={passwordError ? true : undefined}
            aria-describedby={passwordError ? "signup-password-error" : undefined}
            className={controlClassName}
          />
        </FormField>
      </FieldGroup>
      <FieldGroup title="Public profile">
        <FormField label="Name" htmlFor="signup-name">
          <input
            id="signup-name"
            name="name"
            autoComplete="name"
            defaultValue={state.name}
            className={controlClassName}
          />
        </FormField>
        <FormField
          label="Profile picture"
          htmlFor="signup-picture"
          error={pictureError}
          errorId="signup-picture-error"
        >
          <PictureField
            ref={pictureFieldRef}
            inputId="signup-picture"
            displayName={state.name ?? ""}
            username={state.username ?? ""}
          />
        </FormField>
        <FormField label="Bio" htmlFor="signup-bio">
          <textarea
            id="signup-bio"
            name="bio"
            rows={4}
            defaultValue={state.bio}
            className={textareaClassName}
          />
        </FormField>
        <FormField
          label="Timezone"
          htmlFor="signup-timezone"
          error={timezoneError}
          errorId="signup-timezone-error"
        >
          <TimezoneSelect
            key={state.timezone ?? ""}
            id="signup-timezone"
            defaultValue={state.timezone ?? ""}
            invalid={Boolean(timezoneError)}
            describedBy={timezoneError ? "signup-timezone-error" : undefined}
            groups={groups}
          />
        </FormField>
      </FieldGroup>
      <SubmitButton disabled={pending} pendingLabel="Creating account…">
        Sign up
      </SubmitButton>
    </form>
  );
}
