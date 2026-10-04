"use client";

import { useActionState } from "react";
import { updateProfile, type ProfileFormState } from "@/app/actions/profile";

const initialState: ProfileFormState = {};

export function ProfileForm({
  name,
  bio,
  timezone,
}: {
  name: string;
  bio: string;
  timezone: string;
}) {
  const [state, formAction, pending] = useActionState(
    updateProfile,
    initialState,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1" htmlFor="profile-name">
        Name
        <input
          id="profile-name"
          name="name"
          autoComplete="name"
          defaultValue={name}
          className="rounded border border-black/10 bg-transparent px-3 py-2 dark:border-white/15"
        />
      </label>
      <label className="flex flex-col gap-1" htmlFor="profile-picture">
        Profile picture
        <input
          id="profile-picture"
          name="picture"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
        />
      </label>
      <label className="flex flex-col gap-1" htmlFor="profile-bio">
        Bio
        <textarea
          id="profile-bio"
          name="bio"
          rows={4}
          defaultValue={bio}
          className="rounded border border-black/10 bg-transparent px-3 py-2 dark:border-white/15"
        />
      </label>
      <label className="flex flex-col gap-1" htmlFor="profile-timezone">
        Timezone
        <input
          id="profile-timezone"
          name="timezone"
          defaultValue={timezone}
          className="rounded border border-black/10 bg-transparent px-3 py-2 dark:border-white/15"
        />
      </label>
      {state.error ? <p role="alert">{state.error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="h-12 rounded-full bg-foreground px-5 text-background disabled:opacity-60"
      >
        Save
      </button>
    </form>
  );
}
