import type { FeeOutcome } from "@/lib/api/types";
import { HttpError } from "@/lib/http-error";
import { fetchFeeStatus, requestFee } from "@/lib/server/fees";
import {
  completeRegistration,
  requireRegistration,
  setRegistration,
} from "@/lib/server/registration";
import { assertSameOrigin, errorResponse, json } from "@/lib/server/request";
import { rateLimit } from "@/lib/server/rate-limit";

/** Idempotent: while a charge is pending it is reused, never repeated. */
export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    rateLimit(request, "fee");
    const state = await requireRegistration();
    if (!state.pending) throw new HttpError("Complete your details first.", 409);

    if (state.feeReference) {
      const current = await fetchFeeStatus(state.feeReference);
      if (current.status === "COMPLETED") {
        return json<FeeOutcome>({ outcome: "registered", user: await completeRegistration(state) });
      }
      if (current.status !== "FAILED") {
        return json<FeeOutcome>({ outcome: "awaiting_payment" });
      }
    }

    const fee = await requestFee(state);
    const next = { ...state, feeReference: fee.reference };
    await setRegistration(next);

    if (fee.status === "COMPLETED") {
      return json<FeeOutcome>({ outcome: "registered", user: await completeRegistration(next) });
    }
    if (fee.status === "FAILED") {
      throw new HttpError("The payment could not be started. Please try again.", 402);
    }
    return json<FeeOutcome>({ outcome: "awaiting_payment" });
  } catch (error) {
    return errorResponse(error);
  }
}
