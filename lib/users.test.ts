import assert from "node:assert/strict";
import { beforeEach, describe, test } from "node:test";
import { openDatabase } from "./db";
import { readPicture } from "./picture";
import {
  authenticate,
  createUser,
  getPublicProfile,
  updateOwnProfile,
  usernameErrorMessage,
  validateUsername,
} from "./users";

const png = new Uint8Array([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
]);

beforeEach(() => {
  openDatabase(":memory:");
});

describe("username", () => {
  test("requires a username", () => {
    const result = validateUsername("   ");
    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.equal(usernameErrorMessage(result.error), "Username is required.");
    }
  });

  test("rejects usernames that are not allowed", () => {
    for (const username of ["bad/name", "bad\\name", ".", "..", "sign-in"]) {
      const result = validateUsername(username);
      assert.equal(result.ok, false);
      if (!result.ok) {
        assert.equal(result.error, "invalid");
        assert.equal(
          usernameErrorMessage(result.error),
          "Username is not allowed.",
        );
      }
    }
  });

  test("rejects a username that is already taken, including a different case", () => {
    const created = createUser({
      username: "Ada",
      password: "secret",
      name: "Ada",
      bio: "Writes.",
      timezone: "Europe/London",
      picture: { bytes: png, type: "image/png" },
    });
    assert.equal(created.ok, true);

    const duplicate = createUser({
      username: "ada",
      password: "other",
      name: "Other",
      bio: "",
      timezone: "",
      picture: null,
    });
    assert.equal(duplicate.ok, false);
    if (!duplicate.ok) {
      assert.equal(duplicate.error, "taken");
      assert.equal(
        usernameErrorMessage(duplicate.error),
        "Username is already taken.",
      );
    }
  });
});

describe("profile", () => {
  test("stores name, profile picture, bio, and timezone", () => {
    const created = createUser({
      username: "ada",
      password: "secret",
      name: "Ada Lovelace",
      bio: "Writes.",
      timezone: "Europe/London",
      picture: { bytes: png, type: "image/png" },
    });
    assert.equal(created.ok, true);

    const profile = getPublicProfile("ADA");
    assert.ok(profile);
    assert.equal(profile?.username, "ada");
    assert.equal(profile?.name, "Ada Lovelace");
    assert.equal(profile?.bio, "Writes.");
    assert.equal(profile?.timezone, "Europe/London");
    assert.equal(profile?.hasProfilePicture, true);

    const signedIn = authenticate("ada", "secret");
    assert.equal(signedIn?.id, profile?.id);
    assert.equal(authenticate("ada", "wrong"), null);
  });

  test("updates only the given user's profile", () => {
    const ada = createUser({
      username: "ada",
      password: "secret",
      name: "Ada",
      bio: "One",
      timezone: "Europe/London",
      picture: null,
    });
    const grace = createUser({
      username: "grace",
      password: "secret",
      name: "Grace",
      bio: "Two",
      timezone: "America/New_York",
      picture: null,
    });
    assert.equal(ada.ok, true);
    assert.equal(grace.ok, true);
    if (!ada.ok || !grace.ok) {
      return;
    }

    updateOwnProfile(ada.user.id, {
      name: "Ada Lovelace",
      bio: "Updated",
      timezone: "UTC",
      picture: null,
    });

    assert.equal(getPublicProfile("ada")?.name, "Ada Lovelace");
    assert.equal(getPublicProfile("ada")?.bio, "Updated");
    assert.equal(getPublicProfile("grace")?.name, "Grace");
    assert.equal(getPublicProfile("grace")?.bio, "Two");
  });
});

describe("profile picture", () => {
  test("rejects a file that is not an image", async () => {
    const file = new File(["hello"], "notes.txt", { type: "text/plain" });
    const result = await readPicture(file);
    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.equal(result.error, "Profile picture must be an image.");
    }
  });
});
