import type { ApiEnvelope } from "@/lib/api/types";
import { apiRequest } from "@/lib/api/upstream";
import { getRegistration, setRegistration } from "@/lib/server/registration";
import { assertSameOrigin, errorResponse } from "@/lib/server/request";

interface FeeResponse {
  reference?: string;
}

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const state = await getRegistration();
    if (!state?.pending) {
      return Response.json({ message: "Validate your registration first." }, { status: 409 });
    }

    const again = new URL(request.url).searchParams.get("again") === "true";
    const payload = state.pending;
    const fee = await apiRequest<ApiEnvelope<FeeResponse>>(`/fee?again=${again}`, {
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
    await setRegistration({ ...state, feeReference: reference });
    return Response.json(fee);
  } catch (error) {
    return errorResponse(error);
  }
}
