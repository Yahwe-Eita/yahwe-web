"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { FormMessage } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { useChangePassword } from "@/hooks/useChangePassword";
import { getErrorMessage } from "@/lib/error-message";

export function ChangePasswordForm({ pinId }: { pinId: string }) {
  const router = useRouter();
  const changePassword = useChangePassword();
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    changePassword.reset();
    setMessage("");
    const form = new FormData(event.currentTarget);
    const code = String(form.get("code") ?? "");
    const password = String(form.get("password") ?? "");
    const confirm = String(form.get("confirm") ?? "");

    if (password !== confirm) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      await changePassword.mutateAsync({ pinId, code, newPassword: password });
      router.replace("/login?passwordUpdated=true");
    } catch {}
  }

  return (
    <form className="form-stack" onSubmit={submit}>
      <label className="field">
        <span>6-digit code</span>
        <input name="code" inputMode="numeric" placeholder="123456" minLength={6} maxLength={6} required />
      </label>
      <label className="field">
        <span>New password</span>
        <input name="password" type="password" autoComplete="new-password" placeholder="At least 6 characters" minLength={6} required />
      </label>
      <label className="field">
        <span>Confirm new password</span>
        <input name="confirm" type="password" autoComplete="new-password" placeholder="Repeat password" minLength={6} required />
      </label>
      <FormMessage
        message={message || (changePassword.error ? getErrorMessage(changePassword.error, "Couldn't verify your code. Try again.") : undefined)}
      />
      <SubmitButton pending={changePassword.isPending} pendingLabel="UPDATE PASSWORD">
        UPDATE PASSWORD
      </SubmitButton>
    </form>
  );
}
