import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { getDb } from "./db.ts";
import { getUserById, type PublicProfile } from "./users.ts";

export const SESSION_COOKIE = "slotly_session";

const FOURTEEN_DAYS = 60 * 60 * 24 * 14;

export type SessionCookieOptions = {
  httpOnly: true;
  sameSite: "lax";
  secure: boolean;
  path: "/";
  maxAge: number;
};

export function sessionSecret(): string {
  const secret = process.env.SESSION_SECRET ?? "";
  if (secret.length < 32) {
    throw new Error("SESSION_SECRET must be at least 32 characters.");
  }
  return secret;
}

export function sessionCookieOptions(maxAge = FOURTEEN_DAYS): SessionCookieOptions {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}

function sign(sessionId: string): string {
  const mac = createHmac("sha256", sessionSecret())
    .update(sessionId)
    .digest("base64url");
  return `${sessionId}.${mac}`;
}

export function readSessionId(token: string): string | null {
  const separator = token.lastIndexOf(".");
  if (separator <= 0) {
    return null;
  }

  const sessionId = token.slice(0, separator);
  const mac = token.slice(separator + 1);
  const expected = createHmac("sha256", sessionSecret())
    .update(sessionId)
    .digest("base64url");

  const actualBuffer = Buffer.from(mac);
  const expectedBuffer = Buffer.from(expected);
  if (
    actualBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(actualBuffer, expectedBuffer)
  ) {
    return null;
  }

  return sessionId;
}

export function createSession(userId: string): string {
  const id = randomUUID();
  getDb()
    .prepare(`INSERT INTO sessions (id, user_id, created_at) VALUES (?, ?, ?)`)
    .run(id, userId, new Date().toISOString());
  return sign(id);
}

export function sessionUser(token: string | undefined): PublicProfile | null {
  if (!token) {
    return null;
  }

  const sessionId = readSessionId(token);
  if (!sessionId) {
    return null;
  }

  const row = getDb()
    .prepare(`SELECT user_id FROM sessions WHERE id = ?`)
    .get(sessionId) as { user_id: string } | undefined;

  if (!row) {
    return null;
  }

  return getUserById(row.user_id);
}

export function revokeSession(token: string | undefined): void {
  if (!token) {
    return;
  }

  const sessionId = readSessionId(token);
  if (!sessionId) {
    return;
  }

  getDb().prepare(`DELETE FROM sessions WHERE id = ?`).run(sessionId);
}
