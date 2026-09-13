import { apiRequest } from "@/lib/api/upstream";
import { getRegistration, setRegistration } from "@/lib/server/registration";
import { errorResponse } from "@/lib/server/request";

export async function GET(request: Request) {
  try {
    const state = await getRegistration();
    const requestedReference = new URL(request.url).searchParams.get("reference");
    const reference = requestedReference || state?.feeReference;

    if (!reference) {
      return Response.json(
        { message: "Payment session expired. Please register again." },
        { status: 409 },
      );
    }

    if (state && !state.feeReference && reference) {
      await setRegistration({ ...state, feeReference: reference });
    }

    const query = new URLSearchParams({ reference });
    const response = await apiRequest<any>(`/fee/status?${query}`, {
      token: state?.accessToken,
    });

    // Mobile checks: data?.data?.status === "COMPLETED" || "PROCESSING"
    // Handle any upstream response structure safely
    let rawStatus: string | undefined;
    if (typeof response === "string") {
      rawStatus = response;
    } else if (response && typeof response === "object") {
      rawStatus =
        response.data?.status ??
        response.data?.data?.status ??
        (typeof response.data === "string" ? response.data : undefined) ??
        (typeof response.status === "string" ? response.status : undefined);
    }

    const status = (rawStatus || "PENDING").toUpperCase();
    return Response.json({ status, raw: response });
  } catch (error) {
    return errorResponse(error);
  }
}
