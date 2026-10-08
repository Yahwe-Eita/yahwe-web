import type { ApiEnvelope, ResetPasswordResult } from "@/lib/api/types";
import { apiRequest } from "@/lib/api/upstream";
import { HttpError } from "@/lib/http-error";
import { assertSameOrigin, errorResponse, json, readJson } from "@/lib/server/request";
import { emailField } from "@/lib/validation";
import { rateLimit } from "@/lib/server/rate-limit";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    rateLimit(request, "resetPassword");
    const input = await readJson(request);
    const response = await apiRequest<ApiEnvelope<never> & { pinId?: string | null }>(
      "/reset-password",
      { method: "POST", body: JSON.stringify({ email: emailField(input.email) }) },
    );
    if (!response.status || !response.pinId) {
      throw new HttpError(response.message ?? "Unable to start reset. Please try again shortly.", 400);
    }
    return json<ResetPasswordResult>({ pinId: response.pinId, message: response.message ?? "" });
  } catch (error) {
    return errorResponse(error);
  }
}
