import type { PaymentStatusResult } from "@/lib/api/types";
import { HttpError } from "@/lib/http-error";
import { fetchFeeStatus } from "@/lib/server/fees";
import { requireRegistration } from "@/lib/server/registration";
import { errorResponse, json } from "@/lib/server/request";

export async function GET() {
  try {
    const state = await requireRegistration();
    if (!state.feeReference) throw new HttpError("No payment has been started.", 409);
    return json<PaymentStatusResult>(await fetchFeeStatus(state.feeReference));
  } catch (error) {
    return errorResponse(error);
  }
}
