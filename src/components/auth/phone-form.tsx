"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { FormMessage } from "@/components/form-message";
import { RegistrationProgress } from "@/components/auth/registration-progress";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { ButtonLink } from "@/components/ui/button-link";
import { Form } from "@/components/ui/form";
import { NetworkBadge } from "@/components/ui/network-badge";
import { PhoneField } from "@/components/ui/phone-field";
import { Stack } from "@/components/ui/stack";
import { TextField } from "@/components/ui/text-field";
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
    <Stack>
      <RegistrationProgress step={codeSent ? "Verify" : "Phone"} />
      <NetworkBadge>MTN Mobile Money</NetworkBadge>
      <Form onSubmit={findNumber}>
        <PhoneField
          label="Phone number"
          name="phone"
          autoComplete="tel-national"
          placeholder="Enter phone number"
          value={phone}
          onChange={(event) => changePhone(event.target.value)}
          readOnly={codeSent}
          required
        />
        <FormMessage
          message={verifyPhone.error ? getErrorMessage(verifyPhone.error, "Verification failed. Try again later.") : undefined}
        />
        {lookup?.accountExists ? (
          <div className="account-exists-panel" role="status">
            <strong>An account with this number already exists.</strong>
            <ButtonLink variant="small" href="/login">
              Sign in instead
            </ButtonLink>
          </div>
        ) : null}
        {codeSent ? null : (
          <SubmitButton pending={verifyPhone.isPending} pendingLabel="Checking…" disabled={phone.length !== 9}>
            Send code
          </SubmitButton>
        )}
      </Form>

      {codeSent ? (
        <Form onSubmit={confirmCode}>
          <div className="verified-panel" role="status">
            <div>
              <span>MoMo account name</span>
              <strong>{lookup.name}</strong>
            </div>
          </div>
          <TextField
            label={<>Code sent to +{lookup.phone}</>}
            name="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            value={code}
            onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
            pattern="\d{6}"
            required
          />
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
          <ButtonGroup>
            <Button
              variant="small"
              disabled={resendCode.isPending}
              onClick={() => resendCode.mutate()}
            >
              Resend code
            </Button>
            <Button variant="muted" onClick={() => changePhone("")}>
              Change number
            </Button>
          </ButtonGroup>
        </Form>
      ) : null}
    </Stack>
  );
}
