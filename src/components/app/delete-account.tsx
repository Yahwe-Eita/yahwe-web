"use client";

import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { FormMessage } from "@/components/form-message";
import { requestJson } from "@/lib/client-api";

export function DeleteAccount() {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");

  async function remove() {
    setPending(true);
    setMessage("");
    try {
      await requestJson("/api/auth/delete-account", { method: "DELETE" });
      router.replace("/");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Account deletion failed.");
      setConfirming(false);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="danger-zone">
      <div>
        <strong>Delete account</strong>
        <p>Permanently remove your Yahwe-Eita account and sign out.</p>
      </div>
      <button className="danger-button" type="button" onClick={() => setConfirming(true)}>
        Delete account
      </button>
      <FormMessage message={message} />
      <AnimatePresence>
        {confirming ? (
        <motion.div
          className="modal-backdrop"
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.section
            className="modal-card"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            initial={{ opacity: 0, y: 12, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.99 }}
          >
            <div className="modal-heading">
              <div>
                <p className="eyebrow">Permanent action</p>
                <h2 id="delete-title">Delete your account?</h2>
              </div>
            </div>
            <p className="modal-copy">This cannot be undone. Your account will be permanently removed.</p>
            <div className="button-row button-row-end">
              <button className="small-button" type="button" disabled={pending} onClick={() => setConfirming(false)}>
                Cancel
              </button>
              <button className="danger-button" type="button" disabled={pending} onClick={remove}>
                {pending ? "Deleting…" : "Yes, delete"}
              </button>
            </div>
          </motion.section>
        </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
