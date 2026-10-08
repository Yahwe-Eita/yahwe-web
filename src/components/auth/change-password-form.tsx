"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { FormMessage } from "@/components/form-message";
import { PasswordRequirements } from "@/components/auth/password-requirements";
import { SubmitButton } from "@/components/submit-button";
import { Form } from "@/components/ui/form";
import { TextField } from "@/components/ui/text-field";
import { useChangePassword } from "@/hooks/useChangePassword";
import { getErrorMessage } from "@/lib/error-message";
import { getUnmetPasswordRequirement } from "@/lib/password";

export function ChangePasswordForm({ pinId }: { pinId: string }) {
  const router = useRouter();
  const changePassword = useChangePassword();
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
        message={message || (changePassword.error ? getErrorMessage(changePassword.error, "Couldn't verify your code. Try again.") : undefined)}
      />
      <SubmitButton pending={changePassword.isPending} pendingLabel="Updating…">
        Update password
      </SubmitButton>
    </Form>
  );
}
