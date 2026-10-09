import { randomUUID } from "node:crypto";
import { getDb } from "./db.ts";
import { hashPassword, verifyPassword } from "./password.ts";
import type { Picture } from "./picture.ts";
import { isTimezone } from "./timezones.ts";
import {
  usernameErrorMessage,
  validateUsername,
  type UsernameError,
} from "./usernames.ts";

export type PublicProfile = {
  id: string;
  username: string;
  name: string;
  bio: string;
  timezone: string;
  hasProfilePicture: boolean;
  pictureVersion: number;
};

type UserRow = {
  id: string;
  username: string;
  name: string;
  bio: string;
  timezone: string;
  image_bytes: Uint8Array | null;
  image_type: string | null;
  picture_version: number;
};

export type CreateUserInput = {
  username: string;
  password: string;
  name: string;
  bio: string;
  timezone: string;
  picture: Picture | null;
};

export type CreateUserResult =
  | { ok: true; user: { id: string; username: string } }
  | { ok: false; error: UsernameError | "timezone" | "password" };

function isUniqueConstraint(error: unknown): boolean {
  return error instanceof Error && error.message.includes("UNIQUE constraint failed");
}

function toProfile(row: UserRow): PublicProfile {
  return {
    id: row.id,
    username: row.username,
    name: row.name,
    bio: row.bio,
    timezone: row.timezone,
    hasProfilePicture: row.image_bytes !== null && row.image_type !== null,
    pictureVersion: row.picture_version,
  };
}

export function createUser(input: CreateUserInput): CreateUserResult {
  const username = validateUsername(input.username);
  if (!username.ok) {
    return username;
  }

  if (!input.password) {
    return { ok: false, error: "password" };
  }

  if (!isTimezone(input.timezone)) {
    return { ok: false, error: "timezone" };
  }

  const id = randomUUID();
  try {
    getDb()
      .prepare(
        `INSERT INTO users (
          id, username, username_normalized, password_hash, name, bio, timezone, image_bytes, image_type, picture_version
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(
        id,
        username.username,
        username.normalized,
        hashPassword(input.password),
        input.name.trim(),
        input.bio.trim(),
        input.timezone,
        input.picture?.bytes ?? null,
        input.picture?.type ?? null,
        input.picture ? 1 : 0,
      );
  } catch (error) {
    if (isUniqueConstraint(error)) {
      return { ok: false, error: "taken" };
    }
    throw error;
  }

  return { ok: true, user: { id, username: username.username } };
}

export function authenticate(
  username: string,
  password: string,
): { id: string; username: string } | null {
  const validated = validateUsername(username);
  if (!validated.ok) {
    return null;
  }

  const row = getDb()
    .prepare(
      `SELECT id, username, password_hash
       FROM users
       WHERE username_normalized = ?`,
    )
    .get(validated.normalized) as
    | { id: string; username: string; password_hash: string }
    | undefined;

  if (!row || !verifyPassword(password, row.password_hash)) {
    return null;
  }

  return { id: row.id, username: row.username };
}

export function getPublicProfile(username: string): PublicProfile | null {
  const validated = validateUsername(username);
  if (!validated.ok) {
    return null;
  }

  const row = getDb()
    .prepare(
      `SELECT id, username, name, bio, timezone, image_bytes, image_type, picture_version
       FROM users
       WHERE username_normalized = ?`,
    )
    .get(validated.normalized) as UserRow | undefined;

  return row ? toProfile(row) : null;
}

export function getUserById(id: string): PublicProfile | null {
  const row = getDb()
    .prepare(
      `SELECT id, username, name, bio, timezone, image_bytes, image_type, picture_version
       FROM users
       WHERE id = ?`,
    )
    .get(id) as UserRow | undefined;

  return row ? toProfile(row) : null;
}

export function getPicture(
  userId: string,
): { bytes: Uint8Array; type: string } | null {
  const row = getDb()
    .prepare(`SELECT image_bytes, image_type FROM users WHERE id = ?`)
    .get(userId) as
    | { image_bytes: Uint8Array | null; image_type: string | null }
    | undefined;

  if (!row?.image_bytes || !row.image_type) {
    return null;
  }

  return { bytes: row.image_bytes, type: row.image_type };
}

export type ProfileUpdate = {
  name: string;
  bio: string;
  timezone: string;
  picture: Picture | null;
};

export function updateProfile(
  userId: string,
  input: ProfileUpdate,
): { ok: true } | { ok: false; error: "timezone" | "missing" } {
  if (!isTimezone(input.timezone)) {
    return { ok: false, error: "timezone" };
  }

  const existing = getUserById(userId);
  if (!existing) {
    return { ok: false, error: "missing" };
  }

  if (input.picture) {
    getDb()
      .prepare(
        `UPDATE users
         SET name = ?, bio = ?, timezone = ?, image_bytes = ?, image_type = ?, picture_version = picture_version + 1
         WHERE id = ?`,
      )
      .run(
        input.name.trim(),
        input.bio.trim(),
        input.timezone,
        input.picture.bytes,
        input.picture.type,
        userId,
      );
  } else {
    getDb()
      .prepare(
        `UPDATE users
         SET name = ?, bio = ?, timezone = ?
         WHERE id = ?`,
      )
      .run(input.name.trim(), input.bio.trim(), input.timezone, userId);
  }

  return { ok: true };
}

export { usernameErrorMessage };
