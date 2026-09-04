import type { ApiEnvelope } from "@/lib/api/types";
import { apiRequest } from "@/lib/api/upstream";
import {
  getRegistration,
  setRegistration,
} from "@/lib/server/registration";
import { assertSameOrigin, errorResponse } from "@/lib/server/request";
import { ghanaPhoneField, isRecord } from "@/lib/validation";

interface VerificationResponse {
  name?: string;
}

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const state = await getRegistration();
    if (!state) {
      return Response.json(
        { message: "Verify your sponsor before continuing." },
        { status: 409 },
      );
    }

    const input: unknown = await request.json();
    if (!isRecord(input)) throw new Error("Invalid verification request.");
    const phone = ghanaPhoneField(input.phone);
    const channel = "mtn-gh";
    const query = new URLSearchParams({
      type: "phone",
      id: phone.local,
      provider: channel,
    });
    const response = await apiRequest<ApiEnvelope<VerificationResponse>>(
      `/verify?${query}`,
      { token: state.accessToken },
    );

    if (!response.data?.name) {
      return Response.json(
        { message: "The Mobile Money number could not be verified." },
        { status: 404 },
      );
    }

    await setRegistration({
      ...state,
      verifiedName: response.data.name,
      verifiedPhone: phone.international,
      channel,
    });

    return Response.json({ name: response.data.name, phone: phone.international });
  } catch (error) {
    return errorResponse(error);
  }
}
