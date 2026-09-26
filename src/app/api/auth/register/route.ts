import type { RegistrationResult } from "@/lib/api/types";
import { apiRequest } from "@/lib/api/upstream";
import { HttpError } from "@/lib/http-error";
import {
  MOMO_CHANNEL,
  requireRegistration,
  setRegistration,
  type RegistrationPayload,
} from "@/lib/server/registration";
import { assertSameOrigin, errorResponse, json, readJson } from "@/lib/server/request";
import { dateField, emailField, passwordField } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const state = await requireRegistration();
    if (!state.verifiedName || !state.verifiedPhone || !state.verifiedPinId) {
      throw new HttpError("Confirm your Mobile Money number first.", 409);
    }
    if (state.feeReference) {
      throw new HttpError("A payment is already in progress for this registration.", 409);
    }

    const input = await readJson(request);
    const payload: RegistrationPayload = {
      fullName: state.verifiedName,
      email: emailField(input.email),
      password: passwordField(input.password),
      phone: state.verifiedPhone,
      dateOfBirth: dateField(input.dateOfBirth),
      sponsorId: state.sponsorId,
      channel: MOMO_CHANNEL,
      feeId: "",
      platform: /iPhone|iPad|iPod/i.test(request.headers.get("user-agent") ?? "")
        ? "IOS"
        : "ANDROID",
      pinId: state.verifiedPinId,
    };

    await apiRequest("/auth/register?validate_only=true", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    await setRegistration({ ...state, pending: payload });
    return json<RegistrationResult>({ status: "validated" });
  } catch (error) {
    return errorResponse(error);
  }
}
