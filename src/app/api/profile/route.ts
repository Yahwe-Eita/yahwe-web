import type { ApiEnvelope, ProfileData, SuccessResult } from "@/lib/api/types";
import { HttpError } from "@/lib/http-error";
import { sessionRequest } from "@/lib/server/api-session";
import { assertSameOrigin, errorResponse, json } from "@/lib/server/request";
import { clearSession } from "@/lib/server/session";

export async function GET() {
  try {
    const response = await sessionRequest<ApiEnvelope<ProfileData>>("/profile");
    if (!response.data) throw new HttpError("The service is temporarily unavailable. Please try again.", 502);
    return json<ProfileData>(response.data);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request: Request) {
  try {
    assertSameOrigin(request);
    const response = await sessionRequest<ApiEnvelope<unknown>>("/profile", { method: "DELETE" });
    if (response.status !== true) {
      throw new HttpError(response.message ?? "Your account could not be deleted.", 409);
    }
    await clearSession();
    return json<SuccessResult>({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
