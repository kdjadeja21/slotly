import assert from "node:assert/strict";
import { beforeEach, describe, test } from "node:test";
import { openDatabase } from "./db";
import {
  createSessionRecord,
  deleteSessionRecord,
  isSessionRecordActive,
} from "./session-records";
import { createUser } from "./users";

beforeEach(() => {
  openDatabase(":memory:");
});

describe("session records", () => {
  test("revoking a session record stops it from being active", () => {
    const created = createUser({
      username: "ada",
      password: "secret",
      name: "Ada",
      bio: "",
      timezone: "",
      picture: null,
    });
    assert.equal(created.ok, true);
    if (!created.ok) {
      return;
    }

    const expiresAtMs = Date.now() + 60_000;
    const sessionId = createSessionRecord(created.user.id, expiresAtMs);
    assert.equal(isSessionRecordActive(sessionId), true);

    deleteSessionRecord(sessionId);
    assert.equal(isSessionRecordActive(sessionId), false);
  });
});
