"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { FormMessage } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { useRegister } from "@/hooks/useRegister";
import { useFee } from "@/hooks/useFee";
import { getErrorMessage } from "@/lib/error-message";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function RegistrationForm({ fullName, phone }: { fullName: string; phone: string }) {
  const router = useRouter();
  const validateRegistration = useRegister(true);
  const completeRegistration = useRegister(false);
  const fee = useFee();
  const [birthDate, setBirthDate] = useState("");
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [showSaveDetails, setShowSaveDetails] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const data = new FormData(event.currentTarget);
    const password = String(data.get("password") ?? "");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      setMessage("Password must contain at least one symbol");
      return;
    }
    setCredentials({
      email: String(data.get("email") ?? ""),
      password,
    });
    setShowSaveDetails(true);
  }

  async function startPayment() {
    const payload = {
      email: credentials.email,
      password: credentials.password,
      dateOfBirth: birthDate,
    };

    validateRegistration.reset();
    fee.reset();
    completeRegistration.reset();
    try {
      await validateRegistration.mutateAsync(payload);
      const feeResult = await fee.mutateAsync();

      if (feeResult.status === false && feeResult.message === "You already have a fee") {
        await completeRegistration.mutateAsync();
        router.replace("/dashboard");
        router.refresh();
        return;
      }

      router.push("/register/payment");
    } catch {}
  }

  return (
    <>
      <form id="registration-form" className="form-stack" onSubmit={submit}>
      <label className="field">
        <span>Full Name</span>
        <input value={fullName} disabled />
      </label>
      <label className="field">
        <span>Phone Number</span>
        <input value={phone} disabled />
      </label>
      <label className="field">
        <span>Kindly enter your date of birth</span>
        <input name="dateOfBirth" type="date" value={birthDate} onChange={(event) => setBirthDate(event.target.value)} required />
      </label>
      <label className="field">
        <span>Email Address</span>
        <input name="email" type="email" autoComplete="email" placeholder="Enter your email" required />
      </label>
      <label className="field">
        <span>Password</span>
        <input
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="Create a password"
          minLength={8}
          required
        />
      </label>
      <FormMessage
        message={
          message ||
          (validateRegistration.error
            ? getErrorMessage(validateRegistration.error, "Registration validation failed.")
            : undefined) ||
          (fee.error
            ? getErrorMessage(fee.error, "Payment request failed.")
            : undefined) ||
          (completeRegistration.error
            ? getErrorMessage(completeRegistration.error, "Registration failed.")
            : undefined)
        }
      />
      <SubmitButton
        pending={validateRegistration.isPending}
        pendingLabel="CREATE ACCOUNT"
      >
        CREATE ACCOUNT
      </SubmitButton>
      </form>
      <Dialog open={showSaveDetails} onOpenChange={setShowSaveDetails}>
        <DialogContent>
          <DialogHeader>
            <span className="dialog-icon" aria-hidden="true">✓</span>
            <DialogTitle>Save Your Login Details</DialogTitle>
            <DialogDescription>
              Please save these details. You will need them to log in.
            </DialogDescription>
          </DialogHeader>
            <div className="credentials-card">
              <small>Email</small>
              <strong>{credentials.email}</strong>
              <small>Password</small>
              <strong>{credentials.password}</strong>
            </div>
            <p className="warning-text">Take a screenshot or send the details to yourself below.</p>
            <div className="credential-actions">
              <a
                className="small-button"
                href={`sms:${phone}?body=${encodeURIComponent(`Your Yahwe-Eita login details\n\nEmail: ${credentials.email}\nPassword: ${credentials.password}\n\nKeep this private — anyone with these can sign in to your account.`)}`}
              >
                Save to SMS
              </a>
              <a
                className="small-button whatsapp-button"
                href={`https://wa.me/${phone}?text=${encodeURIComponent(`Your Yahwe-Eita login details\n\nEmail: ${credentials.email}\nPassword: ${credentials.password}\n\nKeep this private — anyone with these can sign in to your account.`)}`}
                target="_blank"
                rel="noreferrer"
              >
                Save to WhatsApp
              </a>
            </div>
            <DialogFooter>
              <button className="submit-button" type="button" onClick={() => { setShowSaveDetails(false); setShowPayment(true); }}>
                I&apos;ve Saved My Details
              </button>
              <DialogClose asChild>
                <button className="small-button" type="button">Go Back</button>
              </DialogClose>
            </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent>
          <DialogHeader>
            <span className="dialog-icon dialog-icon-momo" aria-hidden="true">₵</span>
            <DialogTitle>Set up Mobile Money</DialogTitle>
          </DialogHeader>
            <label className="field">
              <span>Phone Number</span>
              <input value={phone} disabled />
            </label>
            <DialogFooter>
            <SubmitButton
              type="button"
              pending={fee.isPending || completeRegistration.isPending}
              pendingLabel="Pay GHS 150 for Airtime"
              onClick={startPayment}
            >
              Pay GHS 150 for Airtime
            </SubmitButton>
              <DialogClose asChild>
                <button className="small-button" type="button">Cancel</button>
              </DialogClose>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
