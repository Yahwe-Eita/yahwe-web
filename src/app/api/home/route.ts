import type { ApiEnvelope, HomeData } from "@/lib/api/types";
import { HttpError } from "@/lib/http-error";
import { sessionRequest } from "@/lib/server/api-session";
import { errorResponse, json } from "@/lib/server/request";

export async function GET() {
  try {
    const response = await sessionRequest<ApiEnvelope<HomeData>>("/home");
    if (!response.data) throw new HttpError("The service is temporarily unavailable. Please try again.", 502);
    return json<HomeData>(response.data);
  } catch (error) {
    return errorResponse(error);
  }
}
