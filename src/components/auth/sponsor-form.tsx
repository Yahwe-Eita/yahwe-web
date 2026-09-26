"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { FormMessage } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { useSponsor } from "@/hooks/useSponsor";
import { getErrorMessage } from "@/lib/error-message";
import { localPhoneDigits } from "@/lib/validation";

export function SponsorForm() {
  const router = useRouter();
  const sponsor = useSponsor();
  const [phone, setPhone] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sponsor.mutate(phone, { onSuccess: () => router.push("/sponsor/confirmation") });
  }

  return (
    <form className="form-stack" onSubmit={submit}>
      <label className="field">
        <span>Sponsor&apos;s phone number</span>
        <div className="phone-field">
          <span aria-hidden="true">+233</span>
          <input
            name="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="off"
            placeholder="241234567"
            value={phone}
            onChange={(event) => setPhone(localPhoneDigits(event.target.value))}
            pattern="\d{9}"
            required
          />
        </div>
        <small>9 digits, without the leading 0</small>
      </label>
      <FormMessage
        message={sponsor.error ? getErrorMessage(sponsor.error, "Your sponsor could not be found. Please try again.") : undefined}
      />
      <SubmitButton pending={sponsor.isPending} pendingLabel="Checking…">
        Verify sponsor
      </SubmitButton>
    </form>
  );
}
