import "server-only";

import type { ApiEnvelope, AuthPayload } from "@/lib/api/types";
import { apiRequest } from "@/lib/api/upstream";
import { HttpError } from "@/lib/http-error";
import {
  clearSession,
  getSession,
  sessionFromAuth,
  writeSession,
  type Session,
} from "@/lib/server/session";

const SESSION_ENDED = "Your session has ended. Please log in again.";
/** How long a rotated token stays reusable by requests that still carry the old cookie. */
const ROTATION_GRACE_MS = 60_000;

const rotations = new Map<string, Promise<Session | null>>();

async function refresh(session: Session): Promise<Session | null> {
  try {
    const response = await apiRequest<ApiEnvelope<AuthPayload>>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken: session.refreshToken }),
    });
    return response.data ? sessionFromAuth(response.data) : null;
  } catch (error) {
    if (error instanceof HttpError && (error.status === 401 || error.status === 403)) {
      return null;
    }
    throw error;
  }
}

function rotate(session: Session) {
  const existing = rotations.get(session.refreshToken);
  if (existing) return existing;

  const pending = refresh(session);
  rotations.set(session.refreshToken, pending);
  const forget = () =>
    setTimeout(() => rotations.delete(session.refreshToken), ROTATION_GRACE_MS);
  pending.then(forget, forget);
  return pending;
}

export async function requireApiSession() {
  const session = await getSession();
  if (!session) throw new HttpError(SESSION_ENDED, 401);
  return session;
}

/** Calls the upstream API as the signed-in member, refreshing an expired access token once. */
export async function sessionRequest<T>(
  path: string,
  init: Omit<RequestInit, "headers"> = {},
): Promise<T> {
  const session = await requireApiSession();
  try {
    return await apiRequest<T>(path, { ...init, token: session.accessToken });
  } catch (error) {
    if (!(error instanceof HttpError) || error.status !== 401) throw error;
  }

  const renewed = await rotate(session);
  if (!renewed) {
    await clearSession();
    throw new HttpError(SESSION_ENDED, 401);
  }
  await writeSession(renewed);
  return apiRequest<T>(path, { ...init, token: renewed.accessToken });
}
