import { createHash, randomUUID } from "node:crypto";
import { getDb } from "./db";
import { hashPassword, verifyPassword } from "./password";
import type { ProfilePicture } from "./picture";

const RESERVED_USERNAMES = new Set([
  "sign-in",
  "sign-up",
  "sign-out",
  "avatars",
]);

export type UsernameError = "required" | "invalid" | "taken";

export type PublicProfile = {
  id: string;
  username: string;
  name: string;
  bio: string;
  timezone: string;
  hasProfilePicture: boolean;
  pictureVersion: string | null;
};

type UserRow = {
  id: string;
  username: string;
  name: string;
  bio: string;
  timezone: string;
  image_bytes: Uint8Array | null;
  image_type: string | null;
  password_hash?: string;
};

export function usernameErrorMessage(error: UsernameError) {
  switch (error) {
    case "required":
      return "Username is required.";
    case "invalid":
      return "Username is not allowed.";
    case "taken":
      return "Username is already taken.";
    default: {
      const neverError: never = error;
      return neverError;
    }
  }
}

export function validateUsername(
  raw: string,
):
  | { ok: true; username: string; normalized: string }
  | { ok: false; error: UsernameError } {
  const username = raw.trim();
  if (!username) {
    return { ok: false, error: "required" };
  }

  const normalized = username.toLowerCase();
  if (
    username.includes("/") ||
    username.includes("\\") ||
    RESERVED_USERNAMES.has(normalized) ||
    normalized === "." ||
    normalized === ".."
  ) {
    return { ok: false, error: "invalid" };
  }

  return { ok: true, username, normalized };
}

function isUniqueViolation(error: unknown) {
  return (
    error instanceof Error && error.message.includes("UNIQUE constraint failed")
  );
}

function pictureVersion(bytes: Uint8Array | null) {
  if (!bytes || bytes.byteLength === 0) {
    return null;
  }

  return createHash("sha256").update(bytes).digest("hex").slice(0, 16);
}

function toPublicProfile(row: UserRow): PublicProfile {
  const version = pictureVersion(row.image_bytes);
  return {
    id: row.id,
    username: row.username,
    name: row.name,
    bio: row.bio,
    timezone: row.timezone,
    hasProfilePicture: version !== null && row.image_type !== null,
    pictureVersion: version,
  };
}

export type CreateUserInput = {
  username: string;
  password: string;
  name: string;
  bio: string;
  timezone: string;
  picture: ProfilePicture | null;
};

export type CreateUserResult =
  | { ok: true; user: { id: string; username: string } }
  | { ok: false; error: UsernameError | "password-required" };

export function createUser(input: CreateUserInput): CreateUserResult {
  const username = validateUsername(input.username);
  if (!username.ok) {
    return username;
  }

  if (input.password.trim() === "") {
    return { ok: false, error: "password-required" };
  }

  const id = randomUUID();
  try {
    getDb()
      .prepare(
        `INSERT INTO users (
          id, username, username_normalized, password_hash, name, bio, timezone, image_bytes, image_type
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(
        id,
        username.username,
        username.normalized,
        hashPassword(input.password),
        input.name.trim(),
        input.bio.trim(),
        input.timezone.trim(),
        input.picture?.bytes ?? null,
        input.picture?.type ?? null,
      );
  } catch (error) {
    if (isUniqueViolation(error)) {
      return { ok: false, error: "taken" };
    }
    throw error;
  }

  return { ok: true, user: { id, username: username.username } };
}

export function authenticate(username: string, password: string) {
  const validated = validateUsername(username);
  if (!validated.ok || password === "") {
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

export function getUserById(id: string) {
  const row = getDb()
    .prepare(
      `SELECT id, username, name, bio, timezone, image_bytes, image_type
       FROM users
       WHERE id = ?`,
    )
    .get(id) as UserRow | undefined;

  if (!row) {
    return null;
  }

  return toPublicProfile(row);
}

export function getPublicProfile(username: string) {
  const validated = validateUsername(username);
  if (!validated.ok) {
    return null;
  }

  const row = getDb()
    .prepare(
      `SELECT id, username, name, bio, timezone, image_bytes, image_type
       FROM users
       WHERE username_normalized = ?`,
    )
    .get(validated.normalized) as UserRow | undefined;

  if (!row) {
    return null;
  }

  return toPublicProfile(row);
}

export function getProfileImage(userId: string) {
  const row = getDb()
    .prepare(
      `SELECT image_bytes, image_type
       FROM users
       WHERE id = ?`,
    )
    .get(userId) as
    | { image_bytes: Uint8Array | null; image_type: string | null }
    | undefined;

  if (!row?.image_bytes || !row.image_type) {
    return null;
  }

  return { bytes: row.image_bytes, type: row.image_type };
}

export function updateOwnProfile(
  userId: string,
  input: {
    name: string;
    bio: string;
    timezone: string;
    picture: ProfilePicture | null;
  },
) {
  const db = getDb();
  db.prepare(
    `UPDATE users
     SET name = ?, bio = ?, timezone = ?
     WHERE id = ?`,
  ).run(input.name.trim(), input.bio.trim(), input.timezone.trim(), userId);

  if (input.picture) {
    db.prepare(
      `UPDATE users
       SET image_bytes = ?, image_type = ?
       WHERE id = ?`,
    ).run(input.picture.bytes, input.picture.type, userId);
  }
}
