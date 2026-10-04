import assert from "node:assert/strict";
import { beforeEach, describe, test } from "node:test";
import { openDatabase } from "./db";
import { createEvent, deleteEvent, listManagedEvents } from "./events";
import { createUser } from "./users";

beforeEach(() => {
  openDatabase(":memory:");
});

function user(username: string) {
  const created = createUser({
    username,
    password: "secret",
    name: username,
    bio: "",
    timezone: "UTC",
    picture: null,
  });
  if (!created.ok) {
    throw new Error("Expected user to be created.");
  }
  return created.user;
}

describe("event management", () => {
  test("a user can manage only their own events", () => {
    const ada = user("ada");
    const grace = user("grace");
    const event = createEvent(ada.id);

    const adaEvents = listManagedEvents(ada.id, ada.id);
    assert.equal(adaEvents.ok, true);
    if (adaEvents.ok) {
      assert.deepEqual(
        adaEvents.events.map((item) => item.id),
        [event.id],
      );
    }

    const otherList = listManagedEvents(grace.id, ada.id);
    assert.deepEqual(otherList, { ok: false, error: "not-owner" });

    const denied = deleteEvent(grace.id, event.id);
    assert.deepEqual(denied, { ok: false, error: "not-owner" });

    const stillThere = listManagedEvents(ada.id, ada.id);
    assert.equal(stillThere.ok, true);
    if (stillThere.ok) {
      assert.equal(stillThere.events.length, 1);
    }

    const removed = deleteEvent(ada.id, event.id);
    assert.deepEqual(removed, { ok: true });

    const afterDelete = listManagedEvents(ada.id, ada.id);
    assert.equal(afterDelete.ok, true);
    if (afterDelete.ok) {
      assert.equal(afterDelete.events.length, 0);
    }
  });
});
