"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { FormMessage } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { useResetPassword } from "@/hooks/useResetPassword";
import { getErrorMessage } from "@/lib/error-message";

export function ResetPasswordForm() {
  const router = useRouter();
  const resetPassword = useResetPassword();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    resetPassword.mutate(
      { email: String(form.get("email") ?? "") },
      { onSuccess: (result) => router.push(`/reset-password/verify?pinId=${encodeURIComponent(result.pinId)}`) },
    );
  }

  return (
    <form className="form-stack" onSubmit={submit}>
      <label className="field">
        <span>Email</span>
        <input name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
      </label>
      <FormMessage
        message={resetPassword.error ? getErrorMessage(resetPassword.error, "The reset could not be started. Please try again.") : undefined}
      />
      <SubmitButton pending={resetPassword.isPending} pendingLabel="Sending code…">
        Send reset code
      </SubmitButton>
    </form>
  );
}
