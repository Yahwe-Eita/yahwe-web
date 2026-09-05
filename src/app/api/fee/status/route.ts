import type { ApiEnvelope } from "@/lib/api/types";
import { apiRequest } from "@/lib/api/upstream";
import { getRegistration } from "@/lib/server/registration";
import { errorResponse } from "@/lib/server/request";

interface FeeStatus {
  status?: string;
}

export async function GET(request: Request) {
  try {
    const state = await getRegistration();
    if (!state?.feeReference || !state.pending) {
      return Response.json({ message: "Payment session expired. Please register again." }, { status: 409 });
    }

    const requestedReference = new URL(request.url).searchParams.get("reference");
    if (requestedReference && requestedReference !== state.feeReference) {
      return Response.json({ message: "Invalid payment reference." }, { status: 400 });
    }

    const query = new URLSearchParams({ reference: state.feeReference });
    const response = await apiRequest<ApiEnvelope<FeeStatus>>(`/fee/status?${query}`, {
      token: state.accessToken,
    });
    return Response.json(response.data ?? { status: "PENDING" });
  } catch (error) {
    return errorResponse(error);
  }
}
