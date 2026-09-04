import { assertSameOrigin, errorResponse } from "@/lib/server/request";
import { clearSession } from "@/lib/server/session";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    await clearSession();
    return Response.json({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
