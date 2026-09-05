"use client";

import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { FormMessage } from "@/components/form-message";
import { useDeleteAccount } from "@/hooks/useDeleteAccount";
import { getErrorMessage } from "@/lib/error-message";

export function DeleteAccount() {
  const router = useRouter();
  const deleteAccount = useDeleteAccount();
  const [confirming, setConfirming] = useState(false);

  async function remove() {
    deleteAccount.reset();
    try {
      await deleteAccount.mutateAsync();
      router.replace("/");
      router.refresh();
    } catch {
      setConfirming(false);
    }
  }

  return (
    <div className="danger-zone">
      <div>
        <strong>Delete Account</strong>
      </div>
      <button className="danger-button" type="button" onClick={() => setConfirming(true)}>
        Delete Account
      </button>
      <FormMessage message={deleteAccount.error ? getErrorMessage(deleteAccount.error, "Account deletion failed.") : undefined} />
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
                <h2 id="delete-title">Delete your account? This action is not reversible!</h2>
              </div>
            </div>
            <div className="button-row button-row-end">
              <button className="small-button" type="button" disabled={deleteAccount.isPending} onClick={() => setConfirming(false)}>
                Cancel
              </button>
              <button className="danger-button" type="button" disabled={deleteAccount.isPending} onClick={remove}>
                {deleteAccount.isPending ? "Deleting..." : "Yes, delete"}
              </button>
            </div>
          </motion.section>
        </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
