import "server-only";

import type { ApiEnvelope, PaymentStatusResult, TransactionStatus } from "@/lib/api/types";
import { apiRequest } from "@/lib/api/upstream";
import { HttpError } from "@/lib/http-error";
import type { RegistrationState } from "@/lib/server/registration";

interface UpstreamFee {
  reference: string;
  status: TransactionStatus;
  failedReason?: string | null;
}

const STATUSES: readonly TransactionStatus[] = ["PENDING", "PROCESSING", "COMPLETED", "FAILED"];

function checkedFee(fee: UpstreamFee | undefined) {
  if (!fee?.reference || !STATUSES.includes(fee.status)) {
    throw new HttpError("The service is temporarily unavailable. Please try again.", 502);
  }
  return fee;
}

export async function fetchFeeStatus(reference: string): Promise<PaymentStatusResult> {
  const query = new URLSearchParams({ reference });
  const response = await apiRequest<ApiEnvelope<UpstreamFee>>(`/fee/status?${query}`);
  const fee = checkedFee(response.data);
  return fee.status === "FAILED"
    ? { status: fee.status, reason: fee.failedReason ?? undefined }
    : { status: fee.status };
}

/** Starts a Mobile Money charge for the pending registration and returns the upstream fee, or a 402 when the charge was refused. */
export async function requestFee(state: RegistrationState) {
  const payload = state.pending;
  if (!payload) throw new HttpError("Complete your details first.", 409);

  const response = await apiRequest<ApiEnvelope<UpstreamFee>>("/fee", {
    method: "POST",
    body: JSON.stringify({
      phone: payload.phone,
      customerName: payload.fullName,
      customerEmail: payload.email,
      channel: payload.channel,
      pinId: payload.pinId,
    }),
  });
  if (response.status === false && !response.data) {
    console.error("[Fee refused]", response.message);
    throw new HttpError("The payment request was not accepted. Check your MoMo wallet and try again.", 402);
  }
  return checkedFee(response.data);
}
