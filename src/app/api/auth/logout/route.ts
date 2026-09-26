import type { SuccessResult } from "@/lib/api/types";
import { apiRequest } from "@/lib/api/upstream";
import { clearRegistration } from "@/lib/server/registration";
import { assertSameOrigin, errorResponse, json } from "@/lib/server/request";
import { clearSession, getSession } from "@/lib/server/session";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const session = await getSession();
    await clearSession();
    await clearRegistration();
    if (session) {
      await apiRequest("/auth/logout", {
        method: "POST",
        body: JSON.stringify({ refreshToken: session.refreshToken }),
      }).catch((error: unknown) => console.error("[Logout revoke failed]", error));
    }
    return json<SuccessResult>({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
