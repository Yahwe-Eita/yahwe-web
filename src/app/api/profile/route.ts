import type { ApiEnvelope, ProfileData } from "@/lib/api/types";
import { apiRequest } from "@/lib/api/upstream";
import { requireApiSession } from "@/lib/server/api-session";
import { errorResponse } from "@/lib/server/request";
import { withProfileFallbacks } from "@/lib/api/compat";
import { assertSameOrigin } from "@/lib/server/request";
import { clearSession } from "@/lib/server/session";

export async function GET() {
  try {
    const session = await requireApiSession();
    const response = await apiRequest<ApiEnvelope<ProfileData>>("/profile", {
      token: session.accessToken,
    });
    return Response.json(withProfileFallbacks(response.data ?? {}));
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request: Request) {
  try {
    assertSameOrigin(request);
    const session = await requireApiSession();
    await apiRequest("/profile", {
      method: "DELETE",
      token: session.accessToken,
    });
    await clearSession();
    return Response.json({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
