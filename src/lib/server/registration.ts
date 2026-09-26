import "server-only";

import { cookies } from "next/headers";
import type { ApiEnvelope, AuthPayload } from "@/lib/api/types";
import { apiRequest } from "@/lib/api/upstream";
import { HttpError } from "@/lib/http-error";
import { cookieOptions } from "@/lib/server/cookies";
import { seal, unseal } from "@/lib/server/seal";
import { setSession } from "@/lib/server/session";

const REGISTRATION_COOKIE = "yahwe_registration";
/** Long enough to cover a slow Mobile Money approval after the details step. */
const REGISTRATION_MAX_AGE = 60 * 60 * 2;

export const MOMO_CHANNEL = "mtn-gh";

export interface RegistrationPayload {
  fullName: string;
  email: string;
  password: string;
  phone: string;
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
  /** Looked up on Mobile Money, waiting for the code sent to it. */
  candidate?: { name: string; phone: string; pinId: string };
  /** Set only once the code sent to the phone has been confirmed. */
  verifiedName?: string;
  verifiedPhone?: string;
  pending?: RegistrationPayload;
  feeReference?: string;
}

export async function getRegistration() {
  const store = await cookies();
  return unseal<RegistrationState>("registration", store.get(REGISTRATION_COOKIE)?.value);
}

export async function requireRegistration() {
  const state = await getRegistration();
  if (!state) {
    throw new HttpError("Your registration has expired. Please start again.", 409);
  }
  return state;
}

export async function setRegistration(state: RegistrationState) {
  const store = await cookies();
  store.set(REGISTRATION_COOKIE, seal("registration", state, REGISTRATION_MAX_AGE), {
    ...cookieOptions,
    maxAge: REGISTRATION_MAX_AGE,
  });
}

export async function clearRegistration() {
  const store = await cookies();
  store.set(REGISTRATION_COOKIE, "", { ...cookieOptions, maxAge: 0 });
}

export async function completeRegistration(state: RegistrationState) {
  if (!state.pending || !state.feeReference) {
    throw new HttpError("Your registration has expired. Please start again.", 409);
  }

  const response = await apiRequest<ApiEnvelope<AuthPayload>>(
    "/auth/register?validate_only=false",
    {
      method: "POST",
      body: JSON.stringify({ ...state.pending, feeId: state.feeReference }),
    },
  );
  if (!response.data) {
    throw new HttpError("The service is temporarily unavailable. Please try again.", 502);
  }

  const user = await setSession(response.data);
  await clearRegistration();
  return user;
}
