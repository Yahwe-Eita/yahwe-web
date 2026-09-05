import type { ApiEnvelope, GenealogyData } from "@/lib/api/types";
import { withGenealogyFallbacks } from "@/lib/api/compat";
import { apiRequest } from "@/lib/api/upstream";
import { requireApiSession } from "@/lib/server/api-session";
import { errorResponse } from "@/lib/server/request";

export async function GET() {
  try {
    const session = await requireApiSession();
    const response = await apiRequest<ApiEnvelope<GenealogyData>>(
      "/geneology",
      { token: session.accessToken },
    );
    if (!response.data?.user) {
      return Response.json({ message: "Malformed genealogy response" }, { status: 502 });
    }
    return Response.json(withGenealogyFallbacks(response.data));
  } catch (error) {
    return errorResponse(error);
  }
}
