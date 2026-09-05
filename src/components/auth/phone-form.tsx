"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FormMessage } from "@/components/form-message";
import { useVerifyPhone } from "@/hooks/useVerifyPhone";
import { getErrorMessage } from "@/lib/error-message";

export function PhoneForm() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [verifiedName, setVerifiedName] = useState("");
  const [accountExists, setAccountExists] = useState(false);
  const requestId = useRef(0);
  const verifyPhone = useVerifyPhone();
  const { mutateAsync, reset } = verifyPhone;

  useEffect(() => {
    if (phone.length !== 9) return;
    const currentRequest = requestId.current;

    const timeout = window.setTimeout(async () => {
      try {
        const result = await mutateAsync({ phone });
        if (currentRequest !== requestId.current) return;

        if (result.accountExists) {
          setAccountExists(true);
          return;
        }

        if (result.name) {
          setVerifiedName(result.name);
          router.push("/register/details");
        }
      } catch {}
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [mutateAsync, phone, router]);

  function updatePhone(value: string) {
    requestId.current += 1;
    reset();
    setVerifiedName("");
    setAccountExists(false);
    const digits = value.replace(/\D/g, "");
    setPhone((digits.startsWith("0") ? digits.slice(1) : digits).slice(0, 9));
  }

  return (
    <div className="form-stack">
      <div className="network-badge">MTN MOBILE MONEY</div>
      <div className="form-stack">
        <label className="field">
          <span>Phone Number</span>
          <div className="phone-field">
            <span aria-hidden="true">+233</span>
            <input
              name="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="Enter phone number"
              value={phone}
              onChange={(event) => updatePhone(event.target.value)}
              minLength={9}
              maxLength={9}
              required
            />
          </div>
          <small>Enter 9 digits without the leading 0</small>
        </label>
        <FormMessage message={verifyPhone.error ? getErrorMessage(verifyPhone.error, "Verification failed. Try again later") : undefined} />
        {accountExists ? (
          <div className="account-exists-panel" role="status">
            <strong>An account with this number already exists.</strong>
            <Link className="small-button" href="/login">
              Sign In Instead
            </Link>
          </div>
        ) : verifiedName ? (
          <div className="verified-panel" role="status">
            <strong>{verifiedName}</strong>
          </div>
        ) : null}
        <button
          className="submit-button"
          type="button"
          disabled={!verifiedName || verifyPhone.isPending || accountExists}
          onClick={() => router.push("/register/details")}
        >
          CONTINUE
        </button>
      </div>
    </div>
  );
}
