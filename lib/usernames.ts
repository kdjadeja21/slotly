const RESERVED = new Set(["sign-in", "sign-up", "avatars"]);

export type UsernameError = "required" | "not-allowed" | "taken";

export function usernameErrorMessage(error: UsernameError): string {
  switch (error) {
    case "required":
      return "Username is required.";
    case "not-allowed":
      return "Username is not allowed.";
    case "taken":
      return "Username is already taken.";
    default: {
      const unreachable: never = error;
      return unreachable;
    }
  }
}

export function validateUsername(
  raw: string,
): { ok: true; username: string; normalized: string } | { ok: false; error: UsernameError } {
  const username = raw.trim();
  if (!username) {
    return { ok: false, error: "required" };
  }

  const normalized = username.toLowerCase();
  if (
    username.includes("/") ||
    username.includes("\\") ||
    username === "." ||
    username === ".." ||
    RESERVED.has(normalized)
  ) {
    return { ok: false, error: "not-allowed" };
  }

  return { ok: true, username, normalized };
}
