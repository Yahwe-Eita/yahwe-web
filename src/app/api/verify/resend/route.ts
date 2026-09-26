import type { ApiEnvelope, SuccessResult } from "@/lib/api/types";
import { apiRequest } from "@/lib/api/upstream";
import { HttpError } from "@/lib/http-error";
import { requireRegistration, setRegistration } from "@/lib/server/registration";
import { assertSameOrigin, errorResponse, json } from "@/lib/server/request";
import { rateLimit } from "@/lib/server/rate-limit";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    rateLimit(request, "phoneLookup");
    const state = await requireRegistration();
    const candidate = state.candidate;
    if (!candidate) throw new HttpError("Enter your Mobile Money number first.", 409);

    const response = await apiRequest<ApiEnvelope<{ pinId: string }>>("/otp/resend", {
      method: "POST",
      body: JSON.stringify({ pinId: candidate.pinId }),
    });
    const pinId = response.data?.pinId;
    if (!pinId) throw new HttpError("The code could not be sent. Please try again.", 502);

    await setRegistration({ ...state, candidate: { ...candidate, pinId } });
    return json<SuccessResult>({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
