"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FormMessage } from "@/components/form-message";
import { RegistrationProgress } from "@/components/auth/registration-progress";
import { SubmitButton } from "@/components/submit-button";
import { usePaymentStatus } from "@/hooks/usePaymentStatus";
import { useRegister } from "@/hooks/useRegister";
import { getErrorMessage } from "@/lib/error-message";

const MAX_POLL_ATTEMPTS = 24; // ~3 minutes with backoff
const BASE_INTERVAL = 5; // Start at 5 seconds
const MAX_INTERVAL = 20; // Cap at 20 seconds

const getNextInterval = (attempt: number) => {
  const interval = Math.min(BASE_INTERVAL * Math.pow(1.3, attempt), MAX_INTERVAL);
  return Math.round(interval);
};

export function PaymentStatus({ reference }: { reference?: string }) {
  const router = useRouter();
  const paymentStatus = usePaymentStatus(reference);
  const completeRegistration = useRegister(false);
  const [seconds, setSeconds] = useState(5);
  const [done, setDone] = useState(false);
  const [isStillPending, setIsStillPending] = useState(false);
  const [pollAttempts, setPollAttempts] = useState(0);
  const [statusError, setStatusError] = useState<string | null>(null);

  const checkStatus = useCallback(async () => {
    if (done) return;
    setStatusError(null);
    try {
      const result = await paymentStatus.mutateAsync();
      const status = (
        result?.status ??
        (typeof result === "string" ? result : "")
      ).toUpperCase();

      if (status === "COMPLETED") {
        setDone(true);
        return;
      }

      if (status === "PROCESSING") {
        setIsStillPending(true);
      }
    } catch (err: unknown) {
      setStatusError(getErrorMessage(err, "Error checking payment status"));
    } finally {
      setPollAttempts((prev) => {
        const next = prev + 1;
        setSeconds(getNextInterval(next));
        return next;
      });
    }
  }, [done, paymentStatus]);

  // Countdown timer for auto-polling
  useEffect(() => {
    if (done || pollAttempts >= MAX_POLL_ATTEMPTS) return;
    if (seconds <= 0) return;
    const timer = window.setTimeout(() => setSeconds((prev) => prev - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [done, pollAttempts, seconds]);

  // Auto-poll when countdown hits 0
  useEffect(() => {
    if (done || pollAttempts >= MAX_POLL_ATTEMPTS || seconds !== 0 || paymentStatus.isPending) {
      return;
    }
    void checkStatus();
  }, [checkStatus, done, paymentStatus.isPending, pollAttempts, seconds]);

  async function proceed() {
    setStatusError(null);
    try {
      await completeRegistration.mutateAsync();
      router.replace("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      setStatusError(getErrorMessage(err, "Registration failed."));
    }
  }

  const handleManualCheck = () => {
    if (paymentStatus.isPending) return;
    void checkStatus();
  };

  return (
    <div className="form-stack">
      <RegistrationProgress currentStep={5} />
      <div className="payment-status-icon" aria-hidden="true">
        ₵
      </div>
      <h2>{done ? "Payment Confirmed" : isStillPending ? "Action Required" : "Awaiting Payment"}</h2>
      <div className="payment-instructions">
        <p>
          {done
            ? "Your payment has been confirmed. Click proceed to complete registration."
            : isStillPending
              ? "If you didn't see a payment pop-up, dial *170#, choose 'My Wallet' > 'My Approvals' to approve your transaction manually."
              : "Your payment is pending. Please authorize the payment on your phone."}
        </p>
      </div>
      {!done ? (
        <p className="payment-auto-check">
          {pollAttempts >= MAX_POLL_ATTEMPTS
            ? "Auto-check stopped. Use the button below to check manually."
            : `Auto-checking in ${seconds}s...`}
        </p>
      ) : null}
      <FormMessage
        message={
          statusError ??
          (paymentStatus.error
            ? getErrorMessage(paymentStatus.error, "Error checking payment")
            : completeRegistration.error
              ? getErrorMessage(completeRegistration.error, "Registration failed.")
              : undefined)
        }
        tone={statusError ? "error" : "info"}
      />
      <SubmitButton
        type="button"
        pending={paymentStatus.isPending || completeRegistration.isPending}
        pendingLabel={done ? "COMPLETE REGISTRATION" : "CHECKING PAYMENT STATUS..."}
        onClick={done ? proceed : handleManualCheck}
      >
        {done ? "COMPLETE REGISTRATION" : "CHECK PAYMENT STATUS"}
      </SubmitButton>
    </div>
  );
}

