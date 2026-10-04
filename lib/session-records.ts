import { randomUUID } from "node:crypto";
import { getDb } from "./db";

export function createSessionRecord(userId: string, expiresAtMs: number) {
  const sessionId = randomUUID();
  getDb()
    .prepare(
      `INSERT INTO sessions (id, user_id, expires_at)
       VALUES (?, ?, ?)`,
    )
    .run(sessionId, userId, expiresAtMs);
  return sessionId;
}

export function deleteSessionRecord(sessionId: string) {
  getDb().prepare(`DELETE FROM sessions WHERE id = ?`).run(sessionId);
}

export function isSessionRecordActive(sessionId: string, nowMs = Date.now()) {
  const row = getDb()
    .prepare(
      `SELECT id
       FROM sessions
       WHERE id = ? AND expires_at > ?`,
    )
    .get(sessionId, nowMs) as { id: string } | undefined;

  return row !== undefined;
}
