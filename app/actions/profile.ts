"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import { readPicture } from "@/lib/picture";
import { updateOwnProfile } from "@/lib/users";

export type ProfileFormState = {
  error?: string;
};

function text(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

export async function updateProfile(
  _state: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const picture = await readPicture(formData.get("picture"));
  if (!picture.ok) {
    return { error: picture.error };
  }

  updateOwnProfile(user.id, {
    name: text(formData, "name"),
    bio: text(formData, "bio"),
    timezone: text(formData, "timezone"),
    picture: picture.picture,
  });

  revalidatePath(`/${user.username}`);
  return {};
}
