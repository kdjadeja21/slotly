"use server";

import { revalidatePath, refresh } from "next/cache";
import { redirect } from "next/navigation";
import { readPicture } from "@/lib/picture";
import { createSession, deleteSession } from "@/lib/session";
import {
  authenticate,
  createUser,
  usernameErrorMessage,
  validateUsername,
} from "@/lib/users";

export type AuthFormState = {
  error?: string;
  username?: string;
  name?: string;
  bio?: string;
  timezone?: string;
};

function text(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

export async function signUp(
  _state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const username = text(formData, "username");
  const password = text(formData, "password");
  const name = text(formData, "name");
  const bio = text(formData, "bio");
  const timezone = text(formData, "timezone");
  const entered = { username, name, bio, timezone };

  const validatedUsername = validateUsername(username);
  if (!validatedUsername.ok) {
    return { ...entered, error: usernameErrorMessage(validatedUsername.error) };
  }

  if (password.trim() === "") {
    return { ...entered, error: "Password is required." };
  }

  const picture = await readPicture(formData.get("picture"));
  if (!picture.ok) {
    return { ...entered, error: picture.error };
  }

  const created = createUser({
    username,
    password,
    name,
    bio,
    timezone,
    picture: picture.picture,
  });

  if (!created.ok) {
    const error =
      created.error === "password-required"
        ? "Password is required."
        : usernameErrorMessage(created.error);
    return { ...entered, error };
  }

  await createSession(created.user.id);
  redirect(`/${encodeURIComponent(created.user.username)}`);
}

export async function signIn(
  _state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const username = text(formData, "username");
  const password = text(formData, "password");

  if (username.trim() === "") {
    return { username, error: "Username is required." };
  }

  if (password === "") {
    return { username, error: "Password is required." };
  }

  const user = authenticate(username, password);
  if (!user) {
    return { username, error: "Invalid username or password." };
  }

  await createSession(user.id);
  redirect(`/${encodeURIComponent(user.username)}`);
}

export async function signOut() {
  await deleteSession();
  revalidatePath("/", "layout");
  refresh();
  redirect("/");
}
