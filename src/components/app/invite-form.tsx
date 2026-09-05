"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState, type FormEvent } from "react";
import { FormMessage } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { useInvite } from "@/hooks/useInvite";
import { getErrorMessage } from "@/lib/error-message";

export function InviteForm() {
  const invite = useInvite();
  const [open, setOpen] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    invite.reset();
    const form = new FormData(event.currentTarget);

    try {
      await invite.mutateAsync({
        name: String(form.get("name") ?? ""),
        phone: String(form.get("phone") ?? ""),
      });
      setOpen(false);
    } catch {}
  }

  return (
    <>
      <button className="primary-action" type="button" onClick={() => setOpen(true)}>
        Enter name and phone number
      </button>
      <AnimatePresence>
        {open ? (
        <motion.div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={() => setOpen(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.section
            className="modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="invite-title"
            onMouseDown={(event) => event.stopPropagation()}
            initial={{ opacity: 0, y: 12, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.99 }}
          >
            <div className="modal-heading">
              <div>
                <h2 id="invite-title">Enter name and phone number</h2>
              </div>
              <button className="icon-button" type="button" onClick={() => setOpen(false)} aria-label="Close">
                ×
              </button>
            </div>
            <form className="form-stack" onSubmit={submit}>
              <label className="field">
                <span className="sr-only">Name</span>
                <input name="name" autoComplete="name" required />
              </label>
              <label className="field">
                <span className="sr-only">Phone</span>
                <input name="phone" type="tel" inputMode="numeric" autoComplete="tel" required />
              </label>
              <FormMessage message={invite.error ? getErrorMessage(invite.error, "Invitation failed.") : undefined} />
              <SubmitButton pending={invite.isPending} pendingLabel="Sending…">
                Submit
              </SubmitButton>
              <button className="small-button" type="button" onClick={() => setOpen(false)}>
                Cancel
              </button>
            </form>
          </motion.section>
        </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
