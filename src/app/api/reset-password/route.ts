import { apiRequest } from "@/lib/api/upstream";
import { assertSameOrigin, errorResponse } from "@/lib/server/request";
import { emailField, isRecord } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const input: unknown = await request.json();
    if (!isRecord(input)) throw new Error("Invalid reset request.");

    const response = await apiRequest<{ status: boolean; message: string; pinId: string | null }>("/reset-password", {
      method: "POST",
      body: JSON.stringify({ email: emailField(input.email) }),
    });
    if (!response.status || !response.pinId) {
      return Response.json(
        { message: response.message || "Unable to start reset. Please try again shortly." },
        { status: 400 },
      );
    }
    return Response.json(response);
  } catch (error) {
    return errorResponse(error);
  }
}
