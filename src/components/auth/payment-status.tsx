"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FormMessage } from "@/components/form-message";
import { RegistrationProgress } from "@/components/auth/registration-progress";
import { SubmitButton } from "@/components/submit-button";
import { usePaymentStatus } from "@/hooks/usePaymentStatus";
import { useRegister } from "@/hooks/useRegister";
import { getErrorMessage } from "@/lib/error-message";

export function PaymentStatus({ reference }: { reference?: string }) {
  const router = useRouter();
  const paymentStatus = usePaymentStatus(reference);
  const completeRegistration = useRegister(false);
  const [seconds, setSeconds] = useState(5);
  const [done, setDone] = useState(false);
  const [isStillPending, setIsStillPending] = useState(false);
  const { mutateAsync: getPaymentStatus, reset: resetPaymentStatus } = paymentStatus;
  const { reset: resetRegistration } = completeRegistration;

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = window.setTimeout(() => setSeconds(seconds - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [seconds]);

  const checkStatus = useCallback(async () => {
    resetPaymentStatus();
    resetRegistration();
    try {
      const result = await getPaymentStatus();
      if (result.status === "COMPLETED") {
        setDone(true);
        return;
      }
      setIsStillPending(true);
      setSeconds(5);
    } catch {}
  }, [getPaymentStatus, resetPaymentStatus, resetRegistration]);

  useEffect(() => {
    if (seconds !== 0 || done || paymentStatus.isPending) return;
    const timer = window.setTimeout(() => void checkStatus(), 0);
    return () => window.clearTimeout(timer);
  }, [checkStatus, done, paymentStatus.isPending, seconds]);

  async function proceed() {
    completeRegistration.reset();
    try {
      await completeRegistration.mutateAsync();
      router.replace("/dashboard");
      router.refresh();
    } catch {}
  }

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
      {!done ? <p className="payment-auto-check">Auto-checking in {seconds}s...</p> : null}
      <FormMessage
        message={
          paymentStatus.error
            ? getErrorMessage(paymentStatus.error, "Error checking payment")
            : completeRegistration.error
              ? getErrorMessage(completeRegistration.error, "Registration failed.")
              : undefined
        }
        tone="info"
      />
      <SubmitButton
        type="button"
        pending={paymentStatus.isPending || completeRegistration.isPending}
        pendingLabel={done ? "COMPLETE REGISTRATION" : "CHECK PAYMENT STATUS"}
        onClick={done ? proceed : checkStatus}
      >
        {done ? "COMPLETE REGISTRATION" : "CHECK PAYMENT STATUS"}
      </SubmitButton>
    </div>
  );
}
