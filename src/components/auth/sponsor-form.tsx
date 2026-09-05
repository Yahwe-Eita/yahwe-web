"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { FormMessage } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { useSponsor } from "@/hooks/useSponsor";
import { getErrorMessage } from "@/lib/error-message";

export function SponsorForm() {
  const router = useRouter();
  const sponsor = useSponsor();
  const [phone, setPhone] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sponsor.reset();
    const form = new FormData(event.currentTarget);

    try {
      await sponsor.mutateAsync(String(form.get("phone") ?? ""));
      router.push("/sponsor/confirmation");
    } catch {}
  }

  return (
    <form className="form-stack" onSubmit={submit}>
      <label className="field">
        <span>Sponsor&apos;s Phone Number</span>
        <div className="phone-field">
          <span aria-hidden="true">+233</span>
          <input
            name="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="Enter phone number"
            value={phone}
            onChange={(event) => {
              const digits = event.target.value.replace(/\D/g, "");
              setPhone((digits.startsWith("0") ? digits.slice(1) : digits).slice(0, 9));
            }}
            minLength={9}
            maxLength={9}
            required
          />
        </div>
        <small>Enter 9 digits without the leading 0</small>
      </label>
      <FormMessage
        message={
          sponsor.error
            ? getErrorMessage(sponsor.error, "Network error")
            : undefined
        }
      />
      <SubmitButton pending={sponsor.isPending} pendingLabel="VERIFY SPONSOR">
        VERIFY SPONSOR
      </SubmitButton>
    </form>
  );
}
