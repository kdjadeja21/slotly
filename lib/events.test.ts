import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { before, test } from "node:test";
import { createEvent, deleteEvent, listManagedEvents } from "./events.ts";
import { createUser } from "./users.ts";

const directory = mkdtempSync(join(tmpdir(), "slotly-events-"));

before(() => {
  process.env.SLOTLY_DB_PATH = join(directory, "slotly.db");
  process.env.SESSION_SECRET = "abcdefghijklmnopqrstuvwxyz123456";
});

function user(username: string): string {
  const created = createUser({
    username,
    password: "secret",
    name: "",
    bio: "",
    timezone: "",
    picture: null,
  });
  assert.equal(created.ok, true);
  if (!created.ok) {
    throw new Error("user was not created");
  }
  return created.user.id;
}

test("a user can list and delete only their own events", () => {
  const ownerId = user("owner");
  const otherId = user("other");
  const event = createEvent(ownerId);

  const denied = listManagedEvents(otherId, ownerId);
  assert.equal(denied.ok, false);

  const owned = listManagedEvents(ownerId, ownerId);
  assert.equal(owned.ok, true);
  if (owned.ok) {
    assert.deepEqual(owned.events, [{ id: event.id, ownerId }]);
  }

  const blockedDelete = deleteEvent(otherId, event.id);
  assert.deepEqual(blockedDelete, { ok: false, error: "not-owner" });

  const removed = deleteEvent(ownerId, event.id);
  assert.deepEqual(removed, { ok: true });

  const after = listManagedEvents(ownerId, ownerId);
  assert.equal(after.ok, true);
  if (after.ok) {
    assert.deepEqual(after.events, []);
  }
});
