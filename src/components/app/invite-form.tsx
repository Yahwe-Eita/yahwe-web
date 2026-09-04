"use client";

import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useState, type FormEvent } from "react";
import { FormMessage } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { requestJson } from "@/lib/client-api";

export function InviteForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    const form = new FormData(event.currentTarget);

    try {
      await requestJson("/api/invites", {
        method: "POST",
        body: JSON.stringify({ name: form.get("name"), phone: form.get("phone") }),
      });
      setOpen(false);
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Invitation failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <button className="primary-action" type="button" onClick={() => setOpen(true)}>
        Invite someone
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
                <p className="eyebrow">New invitation</p>
                <h2 id="invite-title">Invite a downline</h2>
              </div>
              <button className="icon-button" type="button" onClick={() => setOpen(false)} aria-label="Close">
                ×
              </button>
            </div>
            <form className="form-stack" onSubmit={submit}>
              <label className="field">
                <span>Full name</span>
                <input name="name" autoComplete="name" required />
              </label>
              <label className="field">
                <span>Phone number</span>
                <input name="phone" type="tel" inputMode="numeric" autoComplete="tel" required />
              </label>
              <FormMessage message={message} />
              <SubmitButton pending={pending} pendingLabel="Sending…">
                Send invitation
              </SubmitButton>
            </form>
          </motion.section>
        </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
