import "server-only";
import { cache } from "react";
import { readSession } from "./session";
import { getUserById } from "./users";

export const getCurrentUser = cache(async () => {
  const session = await readSession();
  if (!session) {
    return null;
  }

  return getUserById(session.userId);
});
