"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import type { ComponentProps, ReactNode } from "react";

export const Dialog = DialogPrimitive.Root;
export const DialogClose = DialogPrimitive.Close;

export function DialogContent({
  className = "",
  children,
  ...props
}: ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="dialog-overlay" />
      <DialogPrimitive.Content className={`dialog-content ${className}`} {...props}>
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function DialogHeader(props: ComponentProps<"div">) {
  return <div className="dialog-header" {...props} />;
}

export function DialogFooter(props: ComponentProps<"div">) {
  return <div className="dialog-footer" {...props} />;
}

export function DialogTitle(props: ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title className="dialog-title" {...props} />;
}

export function DialogDescription(
  props: ComponentProps<typeof DialogPrimitive.Description>,
) {
  return <DialogPrimitive.Description className="dialog-description" {...props} />;
}

export function DialogIcon({ variant = "default", children }: { variant?: "default" | "momo"; children: ReactNode }) {
  return (
    <span className={variant === "momo" ? "dialog-icon dialog-icon-momo" : "dialog-icon"} aria-hidden="true">
      {children}
    </span>
  );
}
