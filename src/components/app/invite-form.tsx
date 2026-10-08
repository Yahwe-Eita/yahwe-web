"use client";

import { useState, type FormEvent } from "react";
import { FormMessage } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { PhoneField } from "@/components/ui/phone-field";
import { TextField } from "@/components/ui/text-field";
import { useInvite } from "@/hooks/useInvite";
import { getErrorMessage } from "@/lib/error-message";
import { localPhoneDigits } from "@/lib/validation";

export function InviteForm() {
  const invite = useInvite();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  function change(next: boolean) {
    setOpen(next);
    if (!next) {
      invite.reset();
      setName("");
      setPhone("");
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    invite.mutate({ name, phone });
  }

  return (
    <Dialog open={open} onOpenChange={change}>
      <Button variant="action" onClick={() => change(true)}>
        Invite someone
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite someone</DialogTitle>
          <DialogDescription>They will receive an SMS invitation to join under you.</DialogDescription>
        </DialogHeader>
        {invite.isSuccess ? (
          <>
            <FormMessage tone="success" message={`Invitation sent to ${name}.`} />
            <DialogClose asChild>
              <Button variant="submit">
                Done
              </Button>
            </DialogClose>
          </>
        ) : (
          <Form onSubmit={submit}>
            <TextField
              label="Name"
              name="name"
              autoComplete="off"
              value={name}
              onChange={(event) => setName(event.target.value)}
              minLength={2}
              maxLength={100}
              required
            />
            <PhoneField
              label="MTN phone number"
              name="phone"
              autoComplete="off"
              value={phone}
              onChange={(event) => setPhone(localPhoneDigits(event.target.value))}
              required
            />
            <FormMessage
              message={invite.error ? getErrorMessage(invite.error, "The invitation could not be sent. Please try again.") : undefined}
            />
            <SubmitButton pending={invite.isPending} pendingLabel="Sending…">
              Send invitation
            </SubmitButton>
            <DialogClose asChild>
              <Button variant="small">
                Cancel
              </Button>
            </DialogClose>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
