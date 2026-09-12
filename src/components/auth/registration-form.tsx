"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { FormMessage } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { useRegister } from "@/hooks/useRegister";
import { useFee } from "@/hooks/useFee";
import { getErrorMessage } from "@/lib/error-message";
import {
  getUnmetPasswordRequirement,
  passwordRequirements,
} from "@/lib/password";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function RegistrationForm({
  fullName,
  phone,
}: {
  fullName: string;
  phone: string;
}) {
  const router = useRouter();
  const validateRegistration = useRegister(true);
  const completeRegistration = useRegister(false);
  const fee = useFee();
  const [birthDate, setBirthDate] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [showSaveDetails, setShowSaveDetails] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const data = new FormData(event.currentTarget);
    const submittedPassword = String(data.get("password") ?? "");
    const unmetRequirement = getUnmetPasswordRequirement(submittedPassword);
    if (unmetRequirement) {
      setMessage(unmetRequirement.message);
      return;
    }
    setCredentials({
      email: String(data.get("email") ?? ""),
      password: submittedPassword,
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

      if (
        feeResult.status === false &&
        feeResult.message === "You already have a fee"
      ) {
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
          <input
            name="dateOfBirth"
            type="date"
            value={birthDate}
            onChange={(event) => setBirthDate(event.target.value)}
            required
          />
        </label>
        <label className="field">
          <span>Email Address</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Enter your email"
            required
          />
        </label>
        <label className="field">
          <span>Password</span>
          <div className="password-field">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Create a password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              // minLength={8}
              // aria-describedby="password-requirements"
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={`${showPassword ? "Hide" : "Show"} password`}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </label>
        {/* <ul className="password-requirements" id="password-requirements">
          {passwordRequirements.map((requirement) => {
            const isMet = requirement.test(password);
            return (
              <li
                className={isMet ? "requirement-met" : ""}
                key={requirement.id}
              >
                <span aria-hidden="true">{isMet ? "✓" : "○"}</span>
                {requirement.label}
              </li>
            );
          })}
        </ul> */}
        <FormMessage
          message={
            message ||
            (validateRegistration.error
              ? getErrorMessage(
                  validateRegistration.error,
                  "Registration validation failed.",
                )
              : undefined) ||
            (fee.error
              ? getErrorMessage(fee.error, "Payment request failed.")
              : undefined) ||
            (completeRegistration.error
              ? getErrorMessage(
                  completeRegistration.error,
                  "Registration failed.",
                )
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
            <span className="dialog-icon" aria-hidden="true">
              ✓
            </span>
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
          <p className="warning-text">
            Take a screenshot or send the details to yourself below.
          </p>
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
            <button
              className="submit-button"
              type="button"
              onClick={() => {
                setShowSaveDetails(false);
                setShowPayment(true);
              }}
            >
              I&apos;ve Saved My Details
            </button>
            <DialogClose asChild>
              <button className="small-button" type="button">
                Go Back
              </button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent>
          <DialogHeader>
            <span className="dialog-icon dialog-icon-momo" aria-hidden="true">
              ₵
            </span>
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
              className="network-badge"
            >
              Pay GHS 150 for Airtime
            </SubmitButton>
            <DialogClose asChild>
              <button className="small-button" type="button">
                Cancel
              </button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
