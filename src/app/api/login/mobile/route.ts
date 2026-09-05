import type { ApiEnvelope, AuthPayload } from "@/lib/api/types";
import { apiRequest } from "@/lib/api/upstream";
import { assertSameOrigin, errorResponse } from "@/lib/server/request";
import { setSession } from "@/lib/server/session";
import { emailField, isRecord, textField } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const input: unknown = await request.json();
    if (!isRecord(input)) throw new Error("Invalid login request.");

    const response = await apiRequest<ApiEnvelope<AuthPayload>>(
      "/login/mobile",
      {
        method: "POST",
        body: JSON.stringify({
          email: emailField(input.email),
          password: textField(input.password, "Password"),
        }),
      },
    );

    if (!response.data) throw new Error("The login response is incomplete.");
    return Response.json({ user: await setSession(response.data) });
  } catch (error) {
    return errorResponse(error);
  }
}
