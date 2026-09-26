"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { FormMessage } from "@/components/form-message";
import { PasswordRequirements } from "@/components/auth/password-requirements";
import { SubmitButton } from "@/components/submit-button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useFee } from "@/hooks/useFee";
import { useValidateRegistration } from "@/hooks/useValidateRegistration";
import type { Money } from "@/lib/api/types";
import { getErrorMessage } from "@/lib/error-message";
import { formatCurrency } from "@/lib/format";
import { getUnmetPasswordRequirement } from "@/lib/password";

function savedDetailsMessage(email: string, password: string) {
  return `Your Yahwe-Eita login details\n\nEmail: ${email}\nPassword: ${password}\n\nKeep this private. Anyone with these details can log in to your account.`;
}

export function RegistrationForm({
  fullName,
  phone,
  feeAmount,
  latestBirthDate,
}: {
  fullName: string;
  phone: string;
  feeAmount: Money;
  latestBirthDate: string;
}) {
  const router = useRouter();
  const validateRegistration = useValidateRegistration();
  const fee = useFee();
  const paying = useRef(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [showSaveDetails, setShowSaveDetails] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const data = new FormData(event.currentTarget);
    const unmet = getUnmetPasswordRequirement(password);
    if (unmet) {
      setMessage(unmet.message);
      return;
    }
    const input = {
      email: String(data.get("email") ?? ""),
      password,
      dateOfBirth: String(data.get("dateOfBirth") ?? ""),
    };
    validateRegistration.mutate(input, {
      onSuccess: () => {
        setCredentials({ email: input.email, password: input.password });
        setShowSaveDetails(true);
      },
    });
  }

  function startPayment() {
    if (paying.current) return;
    paying.current = true;
    fee.mutate(undefined, {
      onSuccess: (result) => {
        if (result.outcome === "registered") {
          router.replace("/dashboard");
          router.refresh();
          return;
        }
        router.push("/register/payment");
      },
      onError: () => {
        paying.current = false;
      },
    });
  }

  const busy = validateRegistration.isPending || fee.isPending || fee.isSuccess;
  const details = savedDetailsMessage(credentials.email, credentials.password);
  const feeLabel = `Pay ${formatCurrency(feeAmount)} for airtime`;

  return (
    <>
      <form className="form-stack" onSubmit={submit}>
        <label className="field">
          <span>Full name</span>
          <input value={fullName} readOnly />
        </label>
        <label className="field">
          <span>Phone number</span>
          <input value={`+${phone}`} readOnly />
        </label>
        <label className="field">
          <span>Date of birth</span>
          <input name="dateOfBirth" type="date" max={latestBirthDate} required />
        </label>
        <label className="field">
          <span>Email address</span>
          <input name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
        </label>
        <div className="field">
          <label htmlFor="new-password">Password</label>
          <div className="password-field">
            <input
              id="new-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={8}
              aria-describedby="password-requirements"
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        <PasswordRequirements id="password-requirements" password={password} />
        <FormMessage
          message={
            message ||
            (validateRegistration.error
              ? getErrorMessage(validateRegistration.error, "Your details could not be checked. Please try again.")
              : undefined)
          }
        />
        <SubmitButton pending={validateRegistration.isPending} pendingLabel="Checking…">
          Create account
        </SubmitButton>
      </form>

      <Dialog open={showSaveDetails} onOpenChange={setShowSaveDetails}>
        <DialogContent>
          <DialogHeader>
            <span className="dialog-icon" aria-hidden="true">
              ✓
            </span>
            <DialogTitle>Save your login details</DialogTitle>
            <DialogDescription>You will need these to log in.</DialogDescription>
          </DialogHeader>
          <div className="credentials-card">
            <small>Email</small>
            <strong>{credentials.email}</strong>
            <small>Password</small>
            <strong>{credentials.password}</strong>
          </div>
          <p className="warning-text">Take a screenshot or send the details to yourself.</p>
          <div className="credential-actions">
            <a className="small-button" href={`sms:+${phone}?body=${encodeURIComponent(details)}`}>
              Save to SMS
            </a>
            <a
              className="small-button whatsapp-button"
              href={`https://wa.me/${phone}?text=${encodeURIComponent(details)}`}
              target="_blank"
              rel="noreferrer"
            >
              Save to WhatsApp
            </a>
          </div>
          <DialogFooter>
            <button
              className="submit-button"
              type="button"
              onClick={() => {
                setShowSaveDetails(false);
                setShowPayment(true);
              }}
            >
              I&apos;ve saved them
            </button>
            <DialogClose asChild>
              <button className="small-button" type="button">
                Go back
              </button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showPayment} onOpenChange={(open) => !busy && setShowPayment(open)}>
        <DialogContent>
          <DialogHeader>
            <span className="dialog-icon dialog-icon-momo" aria-hidden="true">
              ₵
            </span>
            <DialogTitle>Pay with Mobile Money</DialogTitle>
            <DialogDescription>
              A payment request will appear on +{phone}. Approve it with your MoMo PIN.
            </DialogDescription>
          </DialogHeader>
          <FormMessage
            message={fee.error ? getErrorMessage(fee.error, "The payment could not be started. Please try again.") : undefined}
          />
          <DialogFooter>
            <SubmitButton
              type="button"
              pending={busy}
              pendingLabel="Starting payment…"
              onClick={startPayment}
              className="network-badge"
            >
              {feeLabel}
            </SubmitButton>
            <DialogClose asChild>
              <button className="small-button" type="button" disabled={busy}>
                Cancel
              </button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
