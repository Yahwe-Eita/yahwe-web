import { apiRequest } from "@/lib/api/upstream";
import { assertSameOrigin, errorResponse } from "@/lib/server/request";
import { emailField, isRecord } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const input: unknown = await request.json();
    if (!isRecord(input)) throw new Error("Invalid reset request.");

    await apiRequest("/reset-password", {
      method: "POST",
      body: JSON.stringify({ email: emailField(input.email) }),
    });
    return Response.json({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
