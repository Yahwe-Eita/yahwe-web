import "server-only";

import { cookies } from "next/headers";
import type { AuthPayload, SessionUser } from "@/lib/api/types";
import { seal, unseal } from "@/lib/server/seal";

const SESSION_COOKIE = "yahwe_session";
const THIRTY_DAYS = 60 * 60 * 24 * 30;

export interface Session {
  accessToken: string;
  refreshToken?: string;
  user: SessionUser;
}

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  priority: "high" as const,
};

export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  return unseal<Session>(store.get(SESSION_COOKIE)?.value);
}

export async function setSession(auth: AuthPayload) {
  const id = auth.user.userId ?? auth.user.id;
  if (!auth.access_token || !id || !auth.user.name || !auth.user.email) {
    throw new Error("The authentication response is incomplete.");
  }

  const session: Session = {
    accessToken: auth.access_token,
    refreshToken: auth.refresh_token,
    user: {
      id,
      name: auth.user.name,
      email: auth.user.email,
      picture: auth.user.picture,
    },
  };

  const store = await cookies();
  store.set(SESSION_COOKIE, seal(session), {
    ...cookieOptions,
    maxAge: THIRTY_DAYS,
  });

  return session.user;
}

export async function clearSession() {
  const store = await cookies();
  store.set(SESSION_COOKIE, "", { ...cookieOptions, maxAge: 0 });
}
