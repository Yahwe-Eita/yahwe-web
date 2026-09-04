import type { ApiEnvelope } from "@/lib/api/types";
import { apiRequest } from "@/lib/api/upstream";
import {
  completeRegistration,
  getRegistration,
  setRegistration,
  type RegistrationPayload,
} from "@/lib/server/registration";
import { assertSameOrigin, errorResponse } from "@/lib/server/request";
import {
  dateField,
  emailField,
  isRecord,
  passwordField,
} from "@/lib/validation";

interface FeeResponse {
  reference?: string;
}

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const state = await getRegistration();
    if (
      !state?.verifiedName ||
      !state.verifiedPhone ||
      !state.channel ||
      !state.verifiedGhanaCard
    ) {
      return Response.json(
        {
          message:
            "Verify your sponsor, Mobile Money number, and Ghana Card first.",
        },
        { status: 409 },
      );
    }

    const input: unknown = await request.json();
    if (!isRecord(input)) throw new Error("Invalid registration request.");

    const payload: RegistrationPayload = {
      fullName: state.verifiedName,
      email: emailField(input.email),
      password: passwordField(input.password),
      phone: state.verifiedPhone,
      dateOfBirth: dateField(state.cardDateOfBirth ?? input.dateOfBirth),
      sponsorId: state.sponsorId,
      ghanaCardNumber: state.verifiedGhanaCard,
      channel: state.channel,
      feeId: "",
      platform: "WEB",
    };

    await apiRequest("/auth/register?validate_only=true&again=false", {
      method: "POST",
      token: state.accessToken,
      body: JSON.stringify(payload),
    });

    const fee = await apiRequest<ApiEnvelope<FeeResponse>>("/fee?again=false", {
      method: "POST",
      token: state.accessToken,
      body: JSON.stringify({
        phone: payload.phone,
        customerName: payload.fullName,
        customerEmail: payload.email,
        channel: payload.channel,
      }),
    });
    const reference = fee.data?.reference;
    if (!reference) throw new Error("The payment reference was not returned.");

    const pendingState = { ...state, pending: payload, feeReference: reference };
    await setRegistration(pendingState);

    if (fee.status === false && fee.message === "You already have a fee") {
      const user = await completeRegistration(pendingState);
      return Response.json({ status: "complete", user });
    }

    return Response.json({ status: "pending", reference });
  } catch (error) {
    return errorResponse(error);
  }
}
