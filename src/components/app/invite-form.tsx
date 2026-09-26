"use client";

import { useState, type FormEvent } from "react";
import { FormMessage } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
      <button className="primary-action" type="button" onClick={() => change(true)}>
        Invite someone
      </button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite someone</DialogTitle>
          <DialogDescription>They will receive an SMS invitation to join under you.</DialogDescription>
        </DialogHeader>
        {invite.isSuccess ? (
          <>
            <FormMessage tone="success" message={`Invitation sent to ${name}.`} />
            <DialogClose asChild>
              <button className="submit-button" type="button">
                Done
              </button>
            </DialogClose>
          </>
        ) : (
          <form className="form-stack" onSubmit={submit}>
            <label className="field">
              <span>Name</span>
              <input
                name="name"
                autoComplete="off"
                value={name}
                onChange={(event) => setName(event.target.value)}
                minLength={2}
                maxLength={100}
                required
              />
            </label>
            <label className="field">
              <span>MTN phone number</span>
              <div className="phone-field">
                <span aria-hidden="true">+233</span>
                <input
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="off"
                  value={phone}
                  onChange={(event) => setPhone(localPhoneDigits(event.target.value))}
                  pattern="\d{9}"
                  required
                />
              </div>
              <small>9 digits, without the leading 0</small>
            </label>
            <FormMessage
              message={invite.error ? getErrorMessage(invite.error, "The invitation could not be sent. Please try again.") : undefined}
            />
            <SubmitButton pending={invite.isPending} pendingLabel="Sending…">
              Send invitation
            </SubmitButton>
            <DialogClose asChild>
              <button className="small-button" type="button">
                Cancel
              </button>
            </DialogClose>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
