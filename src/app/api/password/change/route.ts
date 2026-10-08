import type { ApiEnvelope, SuccessResult } from "@/lib/api/types";
import { apiRequest } from "@/lib/api/upstream";
import { HttpError } from "@/lib/http-error";
import { assertSameOrigin, errorResponse, json, readJson } from "@/lib/server/request";
import { passwordField, textField } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const input = await readJson(request);
    const pinId = textField(input.pinId, "Reset session", { max: 128 });
    const code = textField(input.code, "Reset code", { min: 6, max: 6 });
    const newPassword = passwordField(input.newPassword);

    const response = await apiRequest<ApiEnvelope<never>>("/password/change", {
      method: "POST",
      body: JSON.stringify({ pinId, code, newPassword }),
    });
    if (!response.status) {
      throw new HttpError(response.message ?? "Couldn't verify your code. Try again.", 400);
    }
    return json<SuccessResult>({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
