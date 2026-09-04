import type { ApiEnvelope } from "@/lib/api/types";
import { apiRequest } from "@/lib/api/upstream";
import {
  completeRegistration,
  getRegistration,
} from "@/lib/server/registration";
import { assertSameOrigin, errorResponse } from "@/lib/server/request";

interface FeeStatus {
  status?: string;
}

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const state = await getRegistration();
    if (!state?.feeReference || !state.pending) {
      return Response.json(
        { message: "Payment session expired. Please register again." },
        { status: 409 },
      );
    }

    const query = new URLSearchParams({ reference: state.feeReference });
    const response = await apiRequest<ApiEnvelope<FeeStatus>>(
      `/fee/status?${query}`,
      { token: state.accessToken },
    );

    if (response.data?.status !== "COMPLETED") {
      return Response.json({ status: "pending" });
    }

    const user = await completeRegistration(state);
    return Response.json({ status: "complete", user });
  } catch (error) {
    return errorResponse(error);
  }
}
