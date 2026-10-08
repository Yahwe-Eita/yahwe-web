"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormMessage } from "@/components/form-message";
import { Button } from "@/components/ui/button";
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
        <Button variant="danger" onClick={() => setOpen(true)}>
          Delete account
        </Button>
        <DialogContent role="alertdialog">
          <DialogHeader>
            <DialogTitle>Delete your account?</DialogTitle>
            <DialogDescription>This action is not reversible.</DialogDescription>
          </DialogHeader>
          <FormMessage
            message={deleteAccount.error ? getErrorMessage(deleteAccount.error, "Your account could not be deleted.") : undefined}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="small" disabled={deleteAccount.isPending}>
                Cancel
              </Button>
            </DialogClose>
            <Button variant="danger" disabled={deleteAccount.isPending} onClick={remove}>
              {deleteAccount.isPending ? "Deleting…" : "Yes, delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
