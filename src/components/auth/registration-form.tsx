"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { FormMessage } from "@/components/form-message";
import { PasswordRequirements } from "@/components/auth/password-requirements";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { ButtonAnchor } from "@/components/ui/button-anchor";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogIcon,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { PasswordField } from "@/components/ui/password-field";
import { TextField } from "@/components/ui/text-field";
import { useFee } from "@/hooks/useFee";
import { useValidateRegistration } from "@/hooks/useValidateRegistration";
import type { Money } from "@/lib/api/types";
import { getErrorMessage } from "@/lib/error-message";
import { formatCurrency } from "@/lib/format";
import { getUnmetPasswordRequirement } from "@/lib/password";

function savedDetailsMessage(email: string, password: string) {
  return `Your Yahwe-Eita login details\n\nEmail: ${email}\nPassword: ${password}\n\nKeep this private. Anyone with these can sign in to your account.`;
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
      <Form onSubmit={submit}>
        <TextField label="Full name" value={fullName} readOnly />
        <TextField label="Phone number" value={`+${phone}`} readOnly />
        <TextField label="Date of birth" name="dateOfBirth" type="date" max={latestBirthDate} required />
        <TextField label="Email address" name="email" type="email" autoComplete="email" placeholder="Enter your email" required />
        <PasswordField
          id="new-password"
          label="Password"
          name="password"
          autoComplete="new-password"
          placeholder="Create a password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          minLength={8}
          aria-describedby="password-requirements"
          required
        />
        <PasswordRequirements id="password-requirements" password={password} />
        <FormMessage
          message={
            message ||
            (validateRegistration.error
              ? getErrorMessage(validateRegistration.error, "Please review your details and try again.")
              : undefined)
          }
        />
        <SubmitButton pending={validateRegistration.isPending} pendingLabel="Checking…">
          Create account
        </SubmitButton>
      </Form>

      <Dialog open={showSaveDetails} onOpenChange={setShowSaveDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogIcon>✓</DialogIcon>
            <DialogTitle>Save your login details</DialogTitle>
            <DialogDescription>Please save these details. You will need them to log in.</DialogDescription>
          </DialogHeader>
          <div className="credentials-card">
            <small>Email</small>
            <strong>{credentials.email}</strong>
            <small>Password</small>
            <strong>{credentials.password}</strong>
          </div>
          <p className="warning-text">Take a screenshot or send the details to yourself below.</p>
          <ButtonGroup variant="credentials">
            <ButtonAnchor variant="small" href={`sms:+${phone}?body=${encodeURIComponent(details)}`}>
              Save to SMS
            </ButtonAnchor>
            <ButtonAnchor variant="whatsapp" href={`https://wa.me/${phone}?text=${encodeURIComponent(details)}`} external>
              Save to WhatsApp
            </ButtonAnchor>
          </ButtonGroup>
          <DialogFooter>
            <Button
              variant="submit"
              onClick={() => {
                setShowSaveDetails(false);
                setShowPayment(true);
              }}
            >
              I&apos;ve saved my details
            </Button>
            <DialogClose asChild>
              <Button variant="small">
                Go back
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showPayment} onOpenChange={(open) => !busy && setShowPayment(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogIcon variant="momo">₵</DialogIcon>
            <DialogTitle>Set up Mobile Money</DialogTitle>
            <DialogDescription>
              A payment request will appear on +{phone}. Approve it with your MoMo PIN.
            </DialogDescription>
          </DialogHeader>
          <FormMessage
            message={fee.error ? getErrorMessage(fee.error, "Payment failed. Please try again.") : undefined}
          />
          <DialogFooter>
            <SubmitButton
              type="button"
              pending={busy}
              pendingLabel="Starting payment…"
              onClick={startPayment}
              variant="network"
            >
              {feeLabel}
            </SubmitButton>
            <DialogClose asChild>
              <Button variant="small" disabled={busy}>
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
