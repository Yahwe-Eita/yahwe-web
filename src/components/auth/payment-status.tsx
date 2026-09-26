"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { FormMessage } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { useCompleteRegistration } from "@/hooks/useCompleteRegistration";
import { useFee } from "@/hooks/useFee";
import { MAX_STATUS_CHECKS, usePaymentStatus } from "@/hooks/usePaymentStatus";
import { getErrorMessage } from "@/lib/error-message";
import { queryKeys } from "@/lib/query-keys";

export function PaymentStatus({ phone }: { phone: string }) {
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
          ? "Approve the payment"
          : "Waiting for payment";

  const guidance =
    current === "COMPLETED"
      ? "Finish creating your account to go to your dashboard."
      : current === "FAILED"
        ? status.data?.reason ?? "The payment did not go through. No money was taken for this attempt."
        : current === "PROCESSING"
          ? "No prompt on your phone? Dial *170#, choose My Wallet, then My Approvals, and approve it there."
          : `Approve the payment request sent to +${phone} with your MoMo PIN.`;

  return (
    <div className="form-stack">
      <div className="payment-status-icon" aria-hidden="true">
        ₵
      </div>
      <div aria-live="polite" className="form-stack">
        <h2>{heading}</h2>
        <p className="payment-instructions">{guidance}</p>
        {stopped ? (
          <p className="payment-auto-check">
            Automatic checks have stopped. Check again once you have approved the payment.
          </p>
        ) : null}
      </div>
      <FormMessage
        message={
          status.error
            ? getErrorMessage(status.error, "The payment status could not be checked.")
            : retryPayment.error
              ? getErrorMessage(retryPayment.error, "The payment could not be started. Please try again.")
              : completeRegistration.error
                ? getErrorMessage(completeRegistration.error, "Your account could not be created. Please try again.")
                : undefined
        }
      />
      {current === "COMPLETED" ? (
        <SubmitButton type="button" pending={completeRegistration.isPending} pendingLabel="Creating account…" onClick={finish}>
          Finish registration
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
    </div>
  );
}
