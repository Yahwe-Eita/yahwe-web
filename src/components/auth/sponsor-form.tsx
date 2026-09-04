"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { FormMessage } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { requestJson } from "@/lib/client-api";

interface SponsorResult {
  sponsor: { name: string; phone: string };
}

export function SponsorForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    const form = new FormData(event.currentTarget);

    try {
      await requestJson<SponsorResult>(
        "/api/registration/sponsor",
        {
          method: "POST",
          body: JSON.stringify({ phone: form.get("phone") }),
        },
      );
      router.push("/sponsor/confirmation");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Sponsor verification failed.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="form-stack" onSubmit={submit}>
      <label className="field">
        <span>Sponsor phone number</span>
        <div className="phone-field">
          <span aria-hidden="true">+233</span>
          <input
            name="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="24 000 0000"
            minLength={9}
            maxLength={10}
            required
          />
        </div>
        <small>Enter the number with or without the leading zero.</small>
      </label>
      <FormMessage message={message} />
      <SubmitButton pending={pending} pendingLabel="Verifying…">
        Verify sponsor
      </SubmitButton>
    </form>
  );
}
