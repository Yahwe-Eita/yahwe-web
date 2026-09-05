import type { ApiEnvelope, InvitedUser } from "@/lib/api/types";
import { apiRequest } from "@/lib/api/upstream";
import { requireApiSession } from "@/lib/server/api-session";
import { assertSameOrigin, errorResponse } from "@/lib/server/request";
import { getSession } from "@/lib/server/session";
import { ghanaPhoneField, isRecord, textField } from "@/lib/validation";

export async function GET() {
  try {
    const session = await requireApiSession();
    const response = await apiRequest<ApiEnvelope<InvitedUser[]>>("/invites", {
      token: session.accessToken,
    });
    return Response.json(response.data ?? []);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const session = await getSession();
    if (!session) return Response.json({ message: "Unauthorized." }, { status: 401 });

    const input: unknown = await request.json();
    if (!isRecord(input)) throw new Error("Invalid invitation request.");
    const name = textField(input.name, "Name", { max: 100 });
    const phone = ghanaPhoneField(input.phone);

    const response = await apiRequest("/invites", {
      method: "POST",
      token: session.accessToken,
      body: JSON.stringify({ name, phone: `0${phone.local}` }),
    });
    return Response.json({ data: response });
  } catch (error) {
    return errorResponse(error);
  }
}
