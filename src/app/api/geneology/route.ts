import type { ApiEnvelope, GenealogyData } from "@/lib/api/types";
import { HttpError } from "@/lib/http-error";
import { sessionRequest } from "@/lib/server/api-session";
import { errorResponse, json } from "@/lib/server/request";

export async function GET() {
  try {
    const response = await sessionRequest<ApiEnvelope<GenealogyData>>("/geneology");
    if (!response.data?.user) {
      throw new HttpError("The service is temporarily unavailable. Please try again.", 502);
    }
    return json<GenealogyData>(response.data);
  } catch (error) {
    return errorResponse(error);
  }
}
