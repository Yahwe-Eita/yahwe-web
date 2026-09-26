"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { FormMessage } from "@/components/form-message";
import { PasswordRequirements } from "@/components/auth/password-requirements";
import { SubmitButton } from "@/components/submit-button";
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
      setMessage("The passwords do not match.");
      return;
    }
    changePassword.mutate(
      { pinId, code: String(form.get("code") ?? ""), newPassword: password },
      { onSuccess: () => router.replace("/login?passwordUpdated=true") },
    );
  }

  return (
    <form className="form-stack" onSubmit={submit}>
      <label className="field">
        <span>6-digit code</span>
        <input name="code" inputMode="numeric" autoComplete="one-time-code" pattern="\d{6}" maxLength={6} required />
      </label>
      <label className="field">
        <span>New password</span>
        <input
          name="password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          minLength={8}
          aria-describedby="new-password-requirements"
          required
        />
      </label>
      <PasswordRequirements id="new-password-requirements" password={password} />
      <label className="field">
        <span>Confirm new password</span>
        <input name="confirm" type="password" autoComplete="new-password" minLength={8} required />
      </label>
      <FormMessage
        message={message || (changePassword.error ? getErrorMessage(changePassword.error, "The code could not be checked. Please try again.") : undefined)}
      />
      <SubmitButton pending={changePassword.isPending} pendingLabel="Saving…">
        Save new password
      </SubmitButton>
    </form>
  );
}
