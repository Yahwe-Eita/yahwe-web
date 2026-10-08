"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { FormMessage } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Form } from "@/components/ui/form";
import { TextField } from "@/components/ui/text-field";
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
    <Form onSubmit={submit}>
      <TextField label="Email" name="email" type="email" autoComplete="email" placeholder="Enter email" required />
      <FormMessage
        message={resetPassword.error ? getErrorMessage(resetPassword.error, "Failed to request reset. Please try again.") : undefined}
      />
      <SubmitButton pending={resetPassword.isPending} pendingLabel="Sending code…">
        Reset password
      </SubmitButton>
    </Form>
  );
}
