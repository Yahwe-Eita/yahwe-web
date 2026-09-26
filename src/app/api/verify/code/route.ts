import type { ApiEnvelope, SuccessResult } from "@/lib/api/types";
import { apiRequest } from "@/lib/api/upstream";
import { HttpError } from "@/lib/http-error";
import { requireRegistration, setRegistration } from "@/lib/server/registration";
import { assertSameOrigin, errorResponse, json, readJson } from "@/lib/server/request";
import { textField } from "@/lib/validation";
import { rateLimit } from "@/lib/server/rate-limit";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    rateLimit(request, "codeCheck");
    const state = await requireRegistration();
    const candidate = state.candidate;
    if (!candidate) throw new HttpError("Enter your Mobile Money number first.", 409);

    const pin = textField((await readJson(request)).code, "Code", { min: 6, max: 6 });
    if (!/^\d{6}$/.test(pin)) throw new HttpError("Enter the 6-digit code.", 400);

    const query = new URLSearchParams({ pinId: candidate.pinId });
    const response = await apiRequest<ApiEnvelope<unknown>>(`/otp/verify?${query}`, {
      method: "POST",
      body: JSON.stringify({ pin }),
    });
    if (response.status !== true) {
      throw new HttpError(response.message ?? "That code is not correct.", 400);
    }

    await setRegistration({
      sponsorId: state.sponsorId,
      sponsorName: state.sponsorName,
      sponsorPhone: state.sponsorPhone,
      verifiedName: candidate.name,
      verifiedPhone: candidate.phone,
      verifiedPinId: candidate.pinId,
    });
    return json<SuccessResult>({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
