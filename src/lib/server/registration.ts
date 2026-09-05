import "server-only";

import { cookies } from "next/headers";
import type { AuthPayload } from "@/lib/api/types";
import { apiRequest, type UpstreamError } from "@/lib/api/upstream";
import { seal, unseal } from "@/lib/server/seal";
import { setSession } from "@/lib/server/session";

const REGISTRATION_COOKIE = "yahwe_registration";
const ONE_HOUR = 60 * 60;

export interface RegistrationPayload {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  ghanaCardNumber?: string;
  dateOfBirth: string;
  channel: string;
  sponsorId: number;
  feeId: string;
  platform: "IOS" | "ANDROID";
}

export interface RegistrationState {
  sponsorId: number;
  sponsorName: string;
  sponsorPhone: string;
  accessToken?: string;
  verifiedName?: string;
  verifiedPhone?: string;
  channel?: string;
  verifiedGhanaCard?: string;
  cardDateOfBirth?: string;
  pending?: RegistrationPayload;
  feeReference?: string;
}

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  priority: "high" as const,
};

export async function getRegistration() {
  const store = await cookies();
  return unseal<RegistrationState>(store.get(REGISTRATION_COOKIE)?.value);
}

export async function setRegistration(state: RegistrationState) {
  const store = await cookies();
  store.set(REGISTRATION_COOKIE, seal(state), {
    ...cookieOptions,
    maxAge: ONE_HOUR,
  });
}

export async function clearRegistration() {
  const store = await cookies();
  store.set(REGISTRATION_COOKIE, "", { ...cookieOptions, maxAge: 0 });
}

export async function completeRegistration(state: RegistrationState, again = false) {
  if (!state.pending || !state.feeReference) {
    throw new Error("The registration session is incomplete.");
  }

  const response = await apiRequest<{ data?: AuthPayload }>(
    `/auth/register?validate_only=false&again=${again}`,
    {
      method: "POST",
      token: state.accessToken,
      body: JSON.stringify({
        ...state.pending,
        feeId: state.feeReference,
      }),
    },
  );

  if (!response.data) {
    throw new Error("The registration response is incomplete.");
  }

  const user = await setSession(response.data);
  await clearRegistration();
  return user;
}

export function isUpstreamError(error: unknown): error is UpstreamError {
  return (
    error instanceof Error &&
    "status" in error &&
    typeof error.status === "number"
  );
}
