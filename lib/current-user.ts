import { cookies } from "next/headers";
import { SESSION_COOKIE, sessionUser } from "@/lib/session";
import type { PublicProfile } from "@/lib/users";

export async function getCurrentUser(): Promise<PublicProfile | null> {
  const store = await cookies();
  return sessionUser(store.get(SESSION_COOKIE)?.value);
}
