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

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    resetPassword.reset();
    const form = new FormData(event.currentTarget);

    try {
      const result = await resetPassword.mutateAsync({ email: String(form.get("email") ?? "") });
      if (!result.pinId) throw new Error("Unable to start reset. Please try again shortly.");
      router.push(`/reset-password/verify?pinId=${encodeURIComponent(result.pinId)}`);
    } catch {}
  }

  return (
    <form className="form-stack" onSubmit={submit}>
      <label className="field">
        <span className="sr-only">Email</span>
        <input name="email" type="email" autoComplete="email" placeholder="Enter email" required />
      </label>
      <FormMessage message={resetPassword.error ? getErrorMessage(resetPassword.error, "Failed to reset password") : undefined} />
      <SubmitButton pending={resetPassword.isPending} pendingLabel="Reset Password">
        Reset Password
      </SubmitButton>
    </form>
  );
}
