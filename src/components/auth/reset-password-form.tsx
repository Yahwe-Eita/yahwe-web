"use client";

import { useState, type FormEvent } from "react";
import { FormMessage } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { requestJson } from "@/lib/client-api";

export function ResetPasswordForm() {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    const form = new FormData(event.currentTarget);

    try {
      await requestJson("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ email: form.get("email") }),
      });
      setSent(true);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Password reset failed.",
      );
    } finally {
      setPending(false);
    }
  }

  if (sent) {
    return (
      <FormMessage
        tone="success"
        message="Check your inbox for the password reset email."
      />
    );
  }

  return (
    <form className="form-stack" onSubmit={submit}>
      <label className="field">
        <span>Email</span>
        <input name="email" type="email" autoComplete="email" required />
      </label>
      <FormMessage message={message} />
      <SubmitButton pending={pending} pendingLabel="Sending…">
        Send reset email
      </SubmitButton>
    </form>
  );
}
