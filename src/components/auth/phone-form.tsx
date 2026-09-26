"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { FormMessage } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { useResendCode } from "@/hooks/useResendCode";
import { useVerifyCode } from "@/hooks/useVerifyCode";
import { useVerifyPhone } from "@/hooks/useVerifyPhone";
import { getErrorMessage } from "@/lib/error-message";
import { localPhoneDigits } from "@/lib/validation";

export function PhoneForm() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const verifyPhone = useVerifyPhone();
  const verifyCode = useVerifyCode();
  const resendCode = useResendCode();
  const lookup = verifyPhone.data;
  const codeSent = lookup?.accountExists === false;

  function changePhone(value: string) {
    verifyPhone.reset();
    verifyCode.reset();
    resendCode.reset();
    setCode("");
    setPhone(localPhoneDigits(value));
  }

  function findNumber(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    verifyPhone.mutate(phone);
  }

  function confirmCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    verifyCode.mutate(code, { onSuccess: () => router.push("/register/details") });
  }

  return (
    <div className="form-stack">
      <div className="network-badge">MTN Mobile Money</div>
      <form className="form-stack" onSubmit={findNumber}>
        <label className="field">
          <span>Your MoMo number</span>
          <div className="phone-field">
            <span aria-hidden="true">+233</span>
            <input
              name="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder="241234567"
              value={phone}
              onChange={(event) => changePhone(event.target.value)}
              pattern="\d{9}"
              readOnly={codeSent}
              required
            />
          </div>
          <small>9 digits, without the leading 0</small>
        </label>
        <FormMessage
          message={verifyPhone.error ? getErrorMessage(verifyPhone.error, "This number could not be checked. Please try again.") : undefined}
        />
        {lookup?.accountExists ? (
          <div className="account-exists-panel" role="status">
            <strong>This number already has an account.</strong>
            <Link className="small-button" href="/login">
              Log in
            </Link>
          </div>
        ) : null}
        {codeSent ? null : (
          <SubmitButton pending={verifyPhone.isPending} pendingLabel="Checking…" disabled={phone.length !== 9}>
            Send code
          </SubmitButton>
        )}
      </form>

      {codeSent ? (
        <form className="form-stack" onSubmit={confirmCode}>
          <div className="verified-panel" role="status">
            <div>
              <span>MoMo account name</span>
              <strong>{lookup.name}</strong>
            </div>
          </div>
          <label className="field">
            <span>Code sent to +{lookup.phone}</span>
            <input
              name="code"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
              pattern="\d{6}"
              required
            />
          </label>
          <FormMessage
            message={
              verifyCode.error
                ? getErrorMessage(verifyCode.error, "That code did not work. Please try again.")
                : resendCode.error
                  ? getErrorMessage(resendCode.error, "The code could not be sent. Please try again.")
                  : undefined
            }
          />
          <FormMessage tone="success" message={resendCode.isSuccess ? "A new code is on its way." : undefined} />
          <SubmitButton pending={verifyCode.isPending} pendingLabel="Checking…" disabled={code.length !== 6}>
            Continue
          </SubmitButton>
          <div className="button-row">
            <button
              className="small-button"
              type="button"
              disabled={resendCode.isPending}
              onClick={() => resendCode.mutate()}
            >
              Resend code
            </button>
            <button className="small-button small-button-muted" type="button" onClick={() => changePhone("")}>
              Change number
            </button>
          </div>
        </form>
      ) : null}
    </div>
  );
}
