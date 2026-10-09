"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { readPicture } from "@/lib/picture";
import {
  SESSION_COOKIE,
  createSession,
  revokeSession,
  sessionCookieOptions,
} from "@/lib/session";
import { timezoneErrorMessage } from "@/lib/timezones";
import { authenticate, createUser } from "@/lib/users";
import { usernameErrorMessage, type UsernameError } from "@/lib/usernames";

export type AuthFormState = {
  error?: string;
  errorField?: "username" | "password" | "picture" | "timezone";
  username?: string;
  name?: string;
  bio?: string;
  timezone?: string;
};

function text(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function kept(formData: FormData): Pick<AuthFormState, "username" | "name" | "bio" | "timezone"> {
  return {
    username: text(formData, "username"),
    name: text(formData, "name"),
    bio: text(formData, "bio"),
    timezone: text(formData, "timezone"),
  };
}

async function writeSession(userId: string) {
  const store = await cookies();
  store.set(SESSION_COOKIE, createSession(userId), sessionCookieOptions());
}

export async function signUp(
  _state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const fields = kept(formData);
  const password = text(formData, "password");
  const picture = await readPicture(formData);
  if (!picture.ok) {
    return { ...fields, error: picture.error, errorField: "picture" };
  }

  if (!password) {
    return { ...fields, error: "Password is required.", errorField: "password" };
  }

  const created = createUser({
    username: fields.username ?? "",
    password,
    name: fields.name ?? "",
    bio: fields.bio ?? "",
    timezone: fields.timezone ?? "",
    picture: picture.picture,
  });

  if (!created.ok) {
    if (created.error === "password") {
      return { ...fields, error: "Password is required.", errorField: "password" };
    }
    if (created.error === "timezone") {
      return { ...fields, error: timezoneErrorMessage(), errorField: "timezone" };
    }
    const usernameError: UsernameError = created.error;
    return {
      ...fields,
      error: usernameErrorMessage(usernameError),
      errorField: "username",
    };
  }

  await writeSession(created.user.id);
  revalidatePath("/", "layout");
  redirect(`/${encodeURIComponent(created.user.username)}`);
}

export async function signIn(
  _state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const username = text(formData, "username");
  const password = text(formData, "password");

  if (!username.trim()) {
    return { username, error: "Username is required.", errorField: "username" };
  }
  if (!password) {
    return { username, error: "Password is required.", errorField: "password" };
  }

  const user = authenticate(username, password);
  if (!user) {
    return {
      username,
      error: "Username or password is incorrect.",
      errorField: "password",
    };
  }

  await writeSession(user.id);
  revalidatePath("/", "layout");
  redirect(`/${encodeURIComponent(user.username)}`);
}

export async function signOut(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  revokeSession(token);
  store.set(SESSION_COOKIE, "", sessionCookieOptions(0));
  revalidatePath("/", "layout");
  redirect("/");
}
