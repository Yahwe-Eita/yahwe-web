"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { FormMessage } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { requestJson } from "@/lib/client-api";

interface CardResult {
  card: { name?: string; dateOfBirth?: string };
}

interface RegistrationResult {
  status: "complete" | "pending";
  reference?: string;
}

export function RegistrationForm() {
  const router = useRouter();
  const [cardNumber, setCardNumber] = useState("");
  const [cardPending, setCardPending] = useState(false);
  const [cardVerified, setCardVerified] = useState(false);
  const [cardName, setCardName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthDateLocked, setBirthDateLocked] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");

  async function verifyCard() {
    setCardPending(true);
    setCardVerified(false);
    setMessage("");
    try {
      const result = await requestJson<CardResult>(
        "/api/registration/verify-card",
        {
          method: "POST",
          body: JSON.stringify({ id: cardNumber }),
        },
      );
      setCardName(result.card.name ?? "Verified cardholder");
      if (result.card.dateOfBirth) {
        setBirthDate(result.card.dateOfBirth.slice(0, 10));
        setBirthDateLocked(true);
      }
      setCardVerified(true);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Card verification failed.",
      );
    } finally {
      setCardPending(false);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!cardVerified) {
      setMessage("Verify your Ghana Card before continuing.");
      return;
    }

    setPending(true);
    setMessage("");
    const form = new FormData(event.currentTarget);

    try {
      const result = await requestJson<RegistrationResult>(
        "/api/registration/submit",
        {
          method: "POST",
          body: JSON.stringify({
            email: form.get("email"),
            password: form.get("password"),
            dateOfBirth: form.get("dateOfBirth"),
          }),
        },
      );

      if (result.status === "complete") {
        router.replace("/dashboard");
        router.refresh();
        return;
      }

      router.push("/register/payment");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Registration failed.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="form-stack" onSubmit={submit}>
      <label className="field">
        <span>Email</span>
        <input name="email" type="email" autoComplete="email" required />
      </label>
      <label className="field">
        <span>Password</span>
        <input
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
        <small>Use at least 8 characters and one symbol.</small>
      </label>
      <div className="field">
        <span>Ghana Card number</span>
        <div className="inline-field">
          <input
            value={cardNumber}
            onChange={(event) => {
              setCardNumber(event.target.value.toUpperCase());
              setCardVerified(false);
              setCardName("");
              setBirthDate("");
              setBirthDateLocked(false);
            }}
            placeholder="GHA-000000000-0"
            autoComplete="off"
            required
          />
          <button
            className="verify-button"
            type="button"
            disabled={!cardNumber.trim() || cardPending}
            onClick={verifyCard}
          >
            {cardPending ? "Checking…" : "Verify"}
          </button>
        </div>
      </div>
      {cardVerified ? (
        <div className="verified-panel" role="status">
          <span>Ghana Card verified</span>
          <strong>{cardName}</strong>
        </div>
      ) : null}
      <label className="field">
        <span>Date of birth</span>
        <input
          name="dateOfBirth"
          type="date"
          value={birthDate}
          onChange={(event) => setBirthDate(event.target.value)}
          readOnly={birthDateLocked}
          required
        />
      </label>
      <FormMessage message={message} />
      <div className="fee-summary">
        <span>Registration airtime purchase</span>
        <strong>GHS 150</strong>
      </div>
      <SubmitButton pending={pending} pendingLabel="Starting payment…">
        Continue to payment
      </SubmitButton>
    </form>
  );
}
