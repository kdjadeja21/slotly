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
  test("a revoked session record no longer authenticates", () => {
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

    const sessionId = createSessionRecord(created.user.id, Date.now() + 60_000);
    assert.equal(isSessionRecordActive(sessionId), true);

    deleteSessionRecord(sessionId);
    assert.equal(isSessionRecordActive(sessionId), false);
  });
});
