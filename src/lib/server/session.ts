import "server-only";

import { cookies } from "next/headers";
import type { AuthPayload, SessionUser } from "@/lib/api/types";
import { cookieOptions } from "@/lib/server/cookies";
import { seal, unseal } from "@/lib/server/seal";

const SESSION_COOKIE = "yahwe_session";
/** Matches the upstream refresh token lifetime. */
const SESSION_MAX_AGE = 60 * 60 * 24 * 30;

export interface Session {
  accessToken: string;
  refreshToken: string;
  user: SessionUser;
}

export function sessionFromAuth(auth: AuthPayload): Session {
  return {
    accessToken: auth.accessToken,
    refreshToken: auth.refreshToken,
    user: { id: auth.user.userId, name: auth.user.name, email: auth.user.email },
  };
}

export async function getSession() {
  const store = await cookies();
  return unseal<Session>("session", store.get(SESSION_COOKIE)?.value);
}

export async function writeSession(session: Session) {
  const store = await cookies();
  store.set(SESSION_COOKIE, seal("session", session, SESSION_MAX_AGE), {
    ...cookieOptions,
    maxAge: SESSION_MAX_AGE,
  });
  return session.user;
}

export async function setSession(auth: AuthPayload) {
  return writeSession(sessionFromAuth(auth));
}

export async function clearSession() {
  const store = await cookies();
  store.set(SESSION_COOKIE, "", { ...cookieOptions, maxAge: 0 });
}
