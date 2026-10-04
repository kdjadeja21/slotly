"use client";

import { useActionState } from "react";
import { PictureField } from "@/app/components/picture-field";
import { TimezoneSelect } from "@/app/components/timezone-select";
import {
  controlClassName,
  FormAlert,
  FormField,
  SubmitButton,
} from "@/app/components/form-controls";
import { updateProfile, type ProfileFormState } from "@/app/actions/profile";

const initialState: ProfileFormState = {};

export function ProfileForm({
  username,
  name,
  bio,
  timezone,
  pictureSrc,
}: {
  username: string;
  name: string;
  bio: string;
  timezone: string;
  pictureSrc: string | null;
}) {
  const [state, formAction, pending] = useActionState(
    updateProfile,
    initialState,
  );

  return (
    <section className="flex flex-col gap-5 border-t border-black/10 pt-8 dark:border-white/15">
      <h2 className="text-xl font-semibold tracking-tight">Edit profile</h2>
      <form action={formAction} className="flex flex-col gap-5">
        <FormField label="Name" htmlFor="profile-name">
          <input
            id="profile-name"
            name="name"
            autoComplete="name"
            defaultValue={name}
            className={controlClassName}
          />
        </FormField>
        <FormField label="Profile picture" htmlFor="profile-picture">
          <PictureField
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
            className={controlClassName}
          />
        </FormField>
        <FormField label="Timezone" htmlFor="profile-timezone">
          <TimezoneSelect id="profile-timezone" defaultValue={timezone} />
        </FormField>
        {state.error ? <FormAlert>{state.error}</FormAlert> : null}
        <SubmitButton disabled={pending}>Save</SubmitButton>
      </form>
    </section>
  );
}
