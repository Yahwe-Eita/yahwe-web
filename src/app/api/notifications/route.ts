import type { ApiEnvelope, DownlineSignup } from "@/lib/api/types";
import { sessionRequest } from "@/lib/server/api-session";
import { errorResponse, json } from "@/lib/server/request";

export async function GET() {
  try {
    const response = await sessionRequest<ApiEnvelope<DownlineSignup[]>>("/notifications");
    return json<DownlineSignup[]>(response.data ?? []);
  } catch (error) {
    return errorResponse(error);
  }
}
