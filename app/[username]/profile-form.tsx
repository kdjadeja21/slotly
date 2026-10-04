"use client";

import { useActionState, useRef } from "react";
import { saveProfile, type ProfileFormState } from "@/app/actions/profile";
import {
  controlClassName,
  FormAlert,
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

const initialState: ProfileFormState = {};

export function ProfileForm({
  username,
  name,
  bio,
  timezone,
  pictureSrc,
  groups,
}: {
  username: string;
  name: string;
  bio: string;
  timezone: string;
  pictureSrc: string | null;
  groups: TimezoneGroup[];
}) {
  const pictureFieldRef = useRef<PictureFieldHandle>(null);
  const [state, formAction, pending] = useActionState(saveProfile, initialState);
  const pictureError = state.errorField === "picture" ? state.error : undefined;
  const timezoneError = state.errorField === "timezone" ? state.error : undefined;
  const formError =
    state.error && state.errorField !== "picture" && state.errorField !== "timezone"
      ? state.error
      : undefined;

  return (
    <section className="rounded-[28px] border border-line bg-card p-6 shadow-[var(--shadow)] sm:p-8">
      <h2 className="font-display text-3xl tracking-tight text-ink">Edit profile</h2>
      <p className="mt-2 text-sm leading-6 text-muted">
        Name, picture, bio, and timezone are what visitors see.
      </p>
      <form
        action={formAction}
        className="mt-6 flex flex-col gap-5"
        onSubmit={() => {
          pictureFieldRef.current?.syncFileInput();
        }}
      >
        <FormField label="Name" htmlFor="profile-name">
          <input
            id="profile-name"
            name="name"
            autoComplete="name"
            defaultValue={name}
            className={controlClassName}
          />
        </FormField>
        <FormField
          label="Profile picture"
          htmlFor="profile-picture"
          error={pictureError}
          errorId="profile-picture-error"
        >
          <PictureField
            ref={pictureFieldRef}
            inputId="profile-picture"
            displayName={name}
            username={username}
            existingSrc={pictureSrc}
          />
        </FormField>
        <FormField label="Bio" htmlFor="profile-bio">
          <textarea
            id="profile-bio"
            name="bio"
            rows={4}
            defaultValue={bio}
            className={textareaClassName}
          />
        </FormField>
        <FormField
          label="Timezone"
          htmlFor="profile-timezone"
          error={timezoneError}
          errorId="profile-timezone-error"
        >
          <TimezoneSelect
            id="profile-timezone"
            defaultValue={timezone}
            invalid={Boolean(timezoneError)}
            describedBy={timezoneError ? "profile-timezone-error" : undefined}
            groups={groups}
          />
        </FormField>
        {formError ? <FormAlert>{formError}</FormAlert> : null}
        <SubmitButton disabled={pending} pendingLabel="Saving…">
          Save
        </SubmitButton>
      </form>
    </section>
  );
}
