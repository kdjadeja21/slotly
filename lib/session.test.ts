import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { before, test } from "node:test";
import { createUser } from "./users.ts";
import {
  createSession,
  revokeSession,
  sessionCookieOptions,
  sessionUser,
} from "./session.ts";

const directory = mkdtempSync(join(tmpdir(), "slotly-session-"));

before(() => {
  process.env.SLOTLY_DB_PATH = join(directory, "slotly.db");
  process.env.SESSION_SECRET = "abcdefghijklmnopqrstuvwxyz123456";
});

test("sign-out invalidates the previous session token", () => {
  const created = createUser({
    username: "host",
    password: "secret",
    name: "",
    bio: "",
    timezone: "",
    picture: null,
  });
  assert.equal(created.ok, true);
  if (!created.ok) {
    return;
  }

  const token = createSession(created.user.id);
  assert.equal(sessionUser(token)?.username, "host");

  revokeSession(token);
  assert.equal(sessionUser(token), null);
});

test("a tampered session token is rejected", () => {
  const created = createUser({
    username: "guest",
    password: "secret",
    name: "",
    bio: "",
    timezone: "",
    picture: null,
  });
  assert.equal(created.ok, true);
  if (!created.ok) {
    return;
  }

  const token = createSession(created.user.id);
  const tampered = `${token.slice(0, -1)}${token.endsWith("a") ? "b" : "a"}`;
  assert.equal(sessionUser(tampered), null);
  assert.equal(sessionUser(token)?.id, created.user.id);
});

test("cleared session cookies keep the same security flags", () => {
  const active = sessionCookieOptions();
  const cleared = sessionCookieOptions(0);
  assert.equal(cleared.httpOnly, active.httpOnly);
  assert.equal(cleared.sameSite, active.sameSite);
  assert.equal(cleared.path, active.path);
  assert.equal(cleared.secure, active.secure);
  assert.equal(cleared.maxAge, 0);
});
