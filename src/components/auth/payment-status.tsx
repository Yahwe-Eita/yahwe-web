"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FormMessage } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { requestJson } from "@/lib/client-api";

interface PaymentResult {
  status: "complete" | "pending";
}

export function PaymentStatus({ reference }: { reference?: string }) {
  const router = useRouter();
  const [seconds, setSeconds] = useState(15);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = window.setTimeout(() => setSeconds(seconds - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [seconds]);

  async function checkStatus() {
    setPending(true);
    setMessage("");
    try {
      const result = await requestJson<PaymentResult>(
        "/api/registration/payment-status",
        { method: "POST" },
      );
      if (result.status === "complete") {
        router.replace("/dashboard");
        router.refresh();
        return;
      }
      setMessage("Payment is still pending. Approve it and try again.");
      setSeconds(15);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Status check failed.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="form-stack">
      <div className="payment-status-icon" aria-hidden="true">
        ₵
      </div>
      <div className="payment-instructions">
        <p>Approve the Mobile Money request on your phone.</p>
        <p>
          If no prompt appears, dial <strong>*170#</strong>, open My Wallet,
          then My Approvals.
        </p>
        {reference ? <small>Reference: {reference}</small> : null}
      </div>
      <FormMessage message={message} tone="info" />
      <SubmitButton
        type="button"
        pending={pending}
        pendingLabel="Checking…"
        disabled={seconds > 0}
        onClick={checkStatus}
      >
        {seconds > 0 ? `Check status in ${seconds}s` : "Check payment status"}
      </SubmitButton>
    </div>
  );
}
