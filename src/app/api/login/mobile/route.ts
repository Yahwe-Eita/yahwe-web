import type { ApiEnvelope, AuthPayload } from "@/lib/api/types";
import { apiRequest } from "@/lib/api/upstream";
import { HttpError } from "@/lib/http-error";
import { assertSameOrigin, errorResponse, json, readJson } from "@/lib/server/request";
import { setSession } from "@/lib/server/session";
import type { SessionUser } from "@/lib/api/types";
import { emailField, textField } from "@/lib/validation";
import { rateLimit } from "@/lib/server/rate-limit";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    rateLimit(request, "login");
    const input = await readJson(request);
    const response = await apiRequest<ApiEnvelope<AuthPayload>>("/login/mobile", {
      method: "POST",
      body: JSON.stringify({
        email: emailField(input.email),
        password: textField(input.password, "Password", { max: 200 }),
      }),
    });
    if (!response.data) {
      throw new HttpError("The service is temporarily unavailable. Please try again.", 502);
    }
    return json<{ user: SessionUser }>({ user: await setSession(response.data) });
  } catch (error) {
    return errorResponse(error);
  }
}
