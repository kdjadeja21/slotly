import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import {
  createSessionRecord,
  deleteSessionRecord,
  isSessionRecordActive,
} from "./session-records";

const SESSION_COOKIE = "session";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

type SessionPayload = {
  userId: string;
  sessionId: string;
};

function getKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET is not set.");
  }

  return new TextEncoder().encode(secret);
}

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getKey());
}

async function verifiedPayload(session: string | undefined) {
  if (!session) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(session, getKey(), {
      algorithms: ["HS256"],
    });
    if (typeof payload.userId !== "string") {
      return null;
    }
    if (typeof payload.sessionId !== "string") {
      return null;
    }
    return { userId: payload.userId, sessionId: payload.sessionId };
  } catch {
    return null;
  }
}

export async function decrypt(session: string | undefined) {
  const payload = await verifiedPayload(session);
  if (!payload || !isSessionRecordActive(payload.sessionId)) {
    return null;
  }

  return { userId: payload.userId };
}

export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
  const sessionId = createSessionRecord(userId, expiresAt.getTime());
  const session = await encrypt({ userId, sessionId });
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  const payload = await verifiedPayload(
    cookieStore.get(SESSION_COOKIE)?.value,
  );
  if (payload) {
    deleteSessionRecord(payload.sessionId);
  }

  cookieStore.delete(SESSION_COOKIE);
}

export async function readSession() {
  const cookieStore = await cookies();
  return decrypt(cookieStore.get(SESSION_COOKIE)?.value);
}
