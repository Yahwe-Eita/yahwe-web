import type { ApiEnvelope, HomeData } from "@/lib/api/types";
import { apiRequest } from "@/lib/api/upstream";
import { requireApiSession } from "@/lib/server/api-session";
import { errorResponse } from "@/lib/server/request";
import { withHomeFallbacks } from "@/lib/api/compat";

export async function GET() {
  try {
    const session = await requireApiSession();
    const response = await apiRequest<ApiEnvelope<HomeData>>("/home", {
      token: session.accessToken,
    });
    return Response.json(withHomeFallbacks(response.data ?? {}));
  } catch (error) {
    return errorResponse(error);
  }
}
