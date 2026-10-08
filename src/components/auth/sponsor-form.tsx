"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { FormMessage } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Form } from "@/components/ui/form";
import { PhoneField } from "@/components/ui/phone-field";
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
    <Form onSubmit={submit}>
      <PhoneField
        label="Sponsor's phone number"
        name="phone"
        autoComplete="off"
        placeholder="Enter phone number"
        value={phone}
        onChange={(event) => setPhone(localPhoneDigits(event.target.value))}
        required
      />
      <FormMessage
        message={sponsor.error ? getErrorMessage(sponsor.error, "Connection failed. Please check your internet connection.") : undefined}
      />
      <SubmitButton pending={sponsor.isPending} pendingLabel="Checking…">
        Verify sponsor
      </SubmitButton>
    </Form>
  );
}
