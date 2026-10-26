"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { FormMessage } from "@/components/form-message";
import { PasswordRequirements } from "@/components/auth/password-requirements";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { TextField } from "@/components/ui/text-field";
import { useChangePassword } from "@/hooks/useChangePassword";
import { useResendResetCode } from "@/hooks/useResendResetCode";
import { getErrorMessage } from "@/lib/error-message";
import { getUnmetPasswordRequirement } from "@/lib/password";

export function ChangePasswordForm({ pinId }: { pinId: string }) {
  const router = useRouter();
  const changePassword = useChangePassword();
  const resendCode = useResendResetCode();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const form = new FormData(event.currentTarget);
    const unmet = getUnmetPasswordRequirement(password);
    if (unmet) {
      setMessage(unmet.message);
      return;
    }
    if (password !== String(form.get("confirm") ?? "")) {
      setMessage("Passwords do not match.");
      return;
    }
    changePassword.mutate(
      { pinId, code: String(form.get("code") ?? ""), newPassword: password },
      { onSuccess: () => router.replace("/login?passwordUpdated=true") },
    );
  }

  return (
    <Form onSubmit={submit}>
      <TextField label="6-digit code" name="code" inputMode="numeric" autoComplete="one-time-code" placeholder="123456" pattern="\d{6}" maxLength={6} required />
      <TextField
        label="New password"
        name="password"
        type="password"
        autoComplete="new-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        minLength={8}
        aria-describedby="new-password-requirements"
        required
      />
      <PasswordRequirements id="new-password-requirements" password={password} />
      <TextField label="Confirm new password" name="confirm" type="password" autoComplete="new-password" placeholder="Repeat password" minLength={8} required />
      <FormMessage
        message={
          message ||
          (changePassword.error
            ? getErrorMessage(changePassword.error, "Couldn't verify your code. Try again.")
            : resendCode.error
              ? getErrorMessage(resendCode.error, "The code could not be sent. Please try again.")
              : undefined)
        }
      />
      <FormMessage tone="success" message={resendCode.isSuccess ? "A new code is on its way." : undefined} />
      <SubmitButton pending={changePassword.isPending} pendingLabel="Updating…">
        Update password
      </SubmitButton>
      <Button variant="small" disabled={resendCode.isPending} onClick={() => resendCode.mutate(pinId)}>
        Resend code
      </Button>
    </Form>
  );
}
