import { randomUUID } from "node:crypto";
import { getDb } from "./db";

export type EventRecord = {
  id: string;
  ownerId: string;
};

export type ManageEventError = "not-owner" | "not-found";

export function createEvent(actorId: string): EventRecord {
  const id = randomUUID();
  getDb()
    .prepare("INSERT INTO events (id, owner_id) VALUES (?, ?)")
    .run(id, actorId);

  return { id, ownerId: actorId };
}

export function listManagedEvents(
  actorId: string,
  ownerId: string,
): { ok: true; events: EventRecord[] } | { ok: false; error: "not-owner" } {
  if (actorId !== ownerId) {
    return { ok: false, error: "not-owner" };
  }

  const rows = getDb()
    .prepare("SELECT id, owner_id FROM events WHERE owner_id = ?")
    .all(ownerId) as Array<{ id: string; owner_id: string }>;

  return {
    ok: true,
    events: rows.map((row) => ({ id: row.id, ownerId: row.owner_id })),
  };
}

export function deleteEvent(
  actorId: string,
  eventId: string,
): { ok: true } | { ok: false; error: ManageEventError } {
  const row = getDb()
    .prepare("SELECT owner_id FROM events WHERE id = ?")
    .get(eventId) as { owner_id: string } | undefined;

  if (!row) {
    return { ok: false, error: "not-found" };
  }

  if (row.owner_id !== actorId) {
    return { ok: false, error: "not-owner" };
  }

  getDb()
    .prepare("DELETE FROM events WHERE id = ? AND owner_id = ?")
    .run(eventId, actorId);

  return { ok: true };
}
