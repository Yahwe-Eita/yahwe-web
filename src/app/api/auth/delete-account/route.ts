import { apiRequest } from "@/lib/api/upstream";
import { assertSameOrigin, errorResponse } from "@/lib/server/request";
import { clearSession, getSession } from "@/lib/server/session";

export async function DELETE(request: Request) {
  try {
    assertSameOrigin(request);
    const session = await getSession();
    if (!session) return Response.json({ message: "Unauthorized." }, { status: 401 });

    const query = new URLSearchParams({ id: session.user.id });
    await apiRequest(`/admin/users?${query}`, {
      method: "DELETE",
      token: session.accessToken,
    });
    await clearSession();
    return Response.json({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
