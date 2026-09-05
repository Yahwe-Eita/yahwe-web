import { apiRequest } from "@/lib/api/upstream";
import { assertSameOrigin, errorResponse } from "@/lib/server/request";
import { isRecord, textField } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const input: unknown = await request.json();
    if (!isRecord(input)) throw new Error("Invalid password change request.");

    const pinId = textField(input.pinId, "Reset session", { max: 128 });
    const code = textField(input.code, "Reset code", { min: 6, max: 6 });
    const newPassword = textField(input.newPassword, "New password");
    if (newPassword.length < 6) {
      return Response.json(
        { message: "Password must be at least 6 characters" },
        { status: 400 },
      );
    }

    const response = await apiRequest<{ status: boolean; message: string }>(
      "/password/change",
      {
        method: "POST",
        body: JSON.stringify({ pinId, code, newPassword }),
      },
    );
    if (!response.status) {
      return Response.json({ message: response.message }, { status: 400 });
    }
    return Response.json(response);
  } catch (error) {
    return errorResponse(error);
  }
}
