import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { before, test } from "node:test";
import { createUser, getPublicProfile } from "./users.ts";
import { usernameErrorMessage } from "./usernames.ts";

const directory = mkdtempSync(join(tmpdir(), "slotly-users-"));
process.env.SLOTLY_DB_PATH = join(directory, "slotly.db");
process.env.SESSION_SECRET = "abcdefghijklmnopqrstuvwxyz123456";

before(() => {
  process.env.SLOTLY_DB_PATH = join(directory, "slotly.db");
  process.env.SESSION_SECRET = "abcdefghijklmnopqrstuvwxyz123456";
});

test("username is unique regardless of case", () => {
  const created = createUser({
    username: "Ada",
    password: "secret",
    name: "Ada",
    bio: "",
    timezone: "",
    picture: null,
  });
  assert.equal(created.ok, true);

  const again = createUser({
    username: "ada",
    password: "secret",
    name: "",
    bio: "",
    timezone: "",
    picture: null,
  });
  assert.equal(again.ok, false);
  if (!again.ok) {
    assert.equal(again.error, "taken");
    assert.equal(usernameErrorMessage(again.error), "Username is already taken.");
  }
});

test("usernames that break the public path are not allowed", () => {
  for (const username of ["a/b", "a\\b", ".", "..", "sign-in", "Sign-Up", "avatars"]) {
    const result = createUser({
      username,
      password: "secret",
      name: "",
      bio: "",
      timezone: "",
      picture: null,
    });
    assert.equal(result.ok, false, username);
    if (!result.ok) {
      assert.equal(result.error, "not-allowed");
      assert.equal(usernameErrorMessage(result.error), "Username is not allowed.");
    }
  }
});

test("a one-character username is accepted", () => {
  const created = createUser({
    username: "q",
    password: "secret",
    name: "Quill",
    bio: "Writes.",
    timezone: "Europe/London",
    picture: null,
  });
  assert.equal(created.ok, true);

  const profile = getPublicProfile("q");
  assert.ok(profile);
  assert.equal(profile.name, "Quill");
  assert.equal(profile.bio, "Writes.");
  assert.equal(profile.timezone, "Europe/London");
});

test("an empty username is required", () => {
  const result = createUser({
    username: "   ",
    password: "secret",
    name: "",
    bio: "",
    timezone: "",
    picture: null,
  });
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.error, "required");
    assert.equal(usernameErrorMessage(result.error), "Username is required.");
  }
});
