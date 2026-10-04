"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/current-user";
import { readPicture } from "@/lib/picture";
import { timezoneErrorMessage } from "@/lib/timezones";
import { updateProfile } from "@/lib/users";

export type ProfileFormState = {
  error?: string;
  errorField?: "picture" | "timezone";
};

function text(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function saveProfile(
  _state: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Sign in to edit your profile." };
  }

  const picture = await readPicture(formData);
  if (!picture.ok) {
    return { error: picture.error, errorField: "picture" };
  }

  const saved = updateProfile(user.id, {
    name: text(formData, "name"),
    bio: text(formData, "bio"),
    timezone: text(formData, "timezone"),
    picture: picture.picture,
  });

  if (!saved.ok) {
    if (saved.error === "timezone") {
      return { error: timezoneErrorMessage(), errorField: "timezone" };
    }
    return { error: "Profile could not be saved." };
  }

  revalidatePath(`/${encodeURIComponent(user.username)}`);
  revalidatePath("/", "layout");
  return {};
}
