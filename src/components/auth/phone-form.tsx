"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { FormMessage } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { requestJson } from "@/lib/client-api";

interface PhoneResult {
  name: string;
  phone: string;
}

export function PhoneForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [verifiedName, setVerifiedName] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    setVerifiedName("");
    const form = new FormData(event.currentTarget);

    try {
      const result = await requestJson<PhoneResult>(
        "/api/registration/verify-phone",
        {
          method: "POST",
          body: JSON.stringify({ phone: form.get("phone") }),
        },
      );
      setVerifiedName(result.name);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Phone verification failed.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="form-stack">
      <div className="network-badge">MTN Mobile Money</div>
      <form className="form-stack" onSubmit={submit}>
        <label className="field">
          <span>Your Mobile Money number</span>
          <div className="phone-field">
            <span aria-hidden="true">+233</span>
            <input
              name="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              minLength={9}
              maxLength={10}
              required
            />
          </div>
        </label>
        <FormMessage message={message} />
        {verifiedName ? (
          <div className="verified-panel" role="status">
            <span>Verified account</span>
            <strong>{verifiedName}</strong>
          </div>
        ) : null}
        {verifiedName ? (
          <button
            className="submit-button"
            type="button"
            onClick={() => router.push("/register/details")}
          >
            Continue
          </button>
        ) : (
          <SubmitButton pending={pending} pendingLabel="Verifying…">
            Verify number
          </SubmitButton>
        )}
      </form>
    </div>
  );
}
