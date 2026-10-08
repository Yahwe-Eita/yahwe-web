"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { FormMessage } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Stack } from "@/components/ui/stack";
import { useCompleteRegistration } from "@/hooks/useCompleteRegistration";
import { useFee } from "@/hooks/useFee";
import { MAX_STATUS_CHECKS, usePaymentStatus } from "@/hooks/usePaymentStatus";
import { getErrorMessage } from "@/lib/error-message";
import { queryKeys } from "@/lib/query-keys";

export function PaymentStatus() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const status = usePaymentStatus();
  const retryPayment = useFee();
  const completeRegistration = useCompleteRegistration();

  const current = status.data?.status;
  const queryState = queryClient.getQueryState(queryKeys.paymentStatus);
  const checks = (queryState?.dataUpdateCount ?? 0) + (queryState?.errorUpdateCount ?? 0);
  const stopped = checks >= MAX_STATUS_CHECKS && current !== "COMPLETED" && current !== "FAILED";

  function finish() {
    completeRegistration.mutate(undefined, {
      onSuccess: () => {
        router.replace("/dashboard");
        router.refresh();
      },
    });
  }

  function tryAgain() {
    retryPayment.mutate(undefined, {
      onSuccess: (result) => {
        if (result.outcome === "registered") {
          router.replace("/dashboard");
          router.refresh();
          return;
        }
        void queryClient.resetQueries({ queryKey: queryKeys.paymentStatus });
      },
    });
  }

  const heading =
    current === "COMPLETED"
      ? "Payment confirmed"
      : current === "FAILED"
        ? "Payment not completed"
        : current === "PROCESSING"
          ? "Action required"
          : "Awaiting payment";

  const guidance =
    current === "COMPLETED"
      ? "Your payment has been confirmed. Complete registration to finish."
      : current === "FAILED"
        ? status.data?.reason ?? "The payment did not go through. No money was taken for this attempt."
        : current === "PROCESSING"
          ? "If you didn't see a payment pop-up, dial *170#, choose My Wallet > My Approvals to approve your transaction manually."
          : "Your payment is pending. Please authorize the payment on your phone.";

  return (
    <Stack>
      <div className="payment-status-icon" aria-hidden="true">
        ₵
      </div>
      <Stack aria-live="polite">
        <h2>{heading}</h2>
        <p className="payment-instructions">{guidance}</p>
        {stopped ? (
          <p className="payment-auto-check">
            Auto-check stopped. Use the button below to check manually.
          </p>
        ) : null}
      </Stack>
      <FormMessage
        message={
          status.error
            ? getErrorMessage(status.error, "Error checking payment.")
            : retryPayment.error
              ? getErrorMessage(retryPayment.error, "Payment failed. Please try again.")
              : completeRegistration.error
                ? getErrorMessage(completeRegistration.error, "Registration failed. Please try again later.")
                : undefined
        }
      />
      {current === "COMPLETED" ? (
        <SubmitButton type="button" pending={completeRegistration.isPending} pendingLabel="Creating account…" onClick={finish}>
          Complete registration
        </SubmitButton>
      ) : current === "FAILED" ? (
        <SubmitButton type="button" pending={retryPayment.isPending} pendingLabel="Starting payment…" onClick={tryAgain}>
          Try again
        </SubmitButton>
      ) : (
        <SubmitButton
          type="button"
          pending={status.isFetching}
          pendingLabel="Checking…"
          onClick={() => void status.refetch()}
        >
          Check payment status
        </SubmitButton>
      )}
    </Stack>
  );
}
