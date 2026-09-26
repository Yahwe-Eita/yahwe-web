"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormMessage } from "@/components/form-message";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteAccount } from "@/hooks/useDeleteAccount";
import { getErrorMessage } from "@/lib/error-message";

export function DeleteAccount() {
  const router = useRouter();
  const deleteAccount = useDeleteAccount();
  const [open, setOpen] = useState(false);

  function remove() {
    deleteAccount.mutate(undefined, {
      onSuccess: () => {
        router.replace("/");
        router.refresh();
      },
    });
  }

  return (
    <section className="danger-zone" aria-labelledby="delete-heading">
      <h2 id="delete-heading">Delete account</h2>
      <Dialog
        open={open}
        onOpenChange={(next) => {
          if (deleteAccount.isPending) return;
          setOpen(next);
          if (!next) deleteAccount.reset();
        }}
      >
        <button className="danger-button" type="button" onClick={() => setOpen(true)}>
          Delete account
        </button>
        <DialogContent role="alertdialog">
          <DialogHeader>
            <DialogTitle>Delete your account?</DialogTitle>
            <DialogDescription>This cannot be undone.</DialogDescription>
          </DialogHeader>
          <FormMessage
            message={deleteAccount.error ? getErrorMessage(deleteAccount.error, "Your account could not be deleted.") : undefined}
          />
          <DialogFooter>
            <DialogClose asChild>
              <button className="small-button" type="button" disabled={deleteAccount.isPending}>
                Cancel
              </button>
            </DialogClose>
            <button className="danger-button" type="button" disabled={deleteAccount.isPending} onClick={remove}>
              {deleteAccount.isPending ? "Deleting…" : "Delete account"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
