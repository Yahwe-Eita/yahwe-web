import type { ApiEnvelope, SuccessResult } from "@/lib/api/types";
import { apiRequest } from "@/lib/api/upstream";
import { HttpError } from "@/lib/http-error";
import { assertSameOrigin, errorResponse, json, readJson } from "@/lib/server/request";
import { rateLimit } from "@/lib/server/rate-limit";
import { textField } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    rateLimit(request, "resetPassword");
    const input = await readJson(request);
    const pinId = textField(input.pinId, "Reset session", { max: 128 });

    const response = await apiRequest<ApiEnvelope<never> & { pinId?: string | null }>(
      "/password/resend",
      { method: "POST", body: JSON.stringify({ pinId }) },
    );
    if (!response.status || !response.pinId) {
      throw new HttpError("The code could not be sent. Please try again.", 502);
    }
    return json<SuccessResult>({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
