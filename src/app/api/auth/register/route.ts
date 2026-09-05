import { apiRequest } from "@/lib/api/upstream";
import {
  completeRegistration,
  getRegistration,
  setRegistration,
  type RegistrationPayload,
} from "@/lib/server/registration";
import { assertSameOrigin, errorResponse } from "@/lib/server/request";
import { dateField, emailField, isRecord, passwordField } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const state = await getRegistration();
    if (!state?.verifiedName || !state.verifiedPhone || !state.channel) {
      return Response.json(
        { message: "Verify your sponsor and Mobile Money number first." },
        { status: 409 },
      );
    }

    const params = new URL(request.url).searchParams;
    const validateOnly = params.get("validate_only") === "true";
    const again = params.get("again") === "true";

    if (!validateOnly) {
      return Response.json({
        status: "complete",
        user: await completeRegistration(state, again),
      });
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
      platform: /iPhone|iPad|iPod/i.test(request.headers.get("user-agent") ?? "")
        ? "IOS"
        : "ANDROID",
    };

    await apiRequest(`/auth/register?validate_only=true&again=${again}`, {
      method: "POST",
      token: state.accessToken,
      body: JSON.stringify(payload),
    });
    await setRegistration({ ...state, pending: payload });
    return Response.json({ status: "validated" });
  } catch (error) {
    return errorResponse(error);
  }
}
