"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { buttonClassName } from "@/components/ui/button-variants";

interface SubmitButtonProps extends HTMLMotionProps<"button"> {
  pending?: boolean;
  pendingLabel: string;
  variant?: "submit" | "network";
}

export function SubmitButton({
  children,
  pending,
  pendingLabel,
  variant = "submit",
  className,
  disabled,
  ...props
}: SubmitButtonProps) {
  const inactive = disabled || pending;
  return (
    <motion.button
      className={buttonClassName(variant, className)}
      disabled={inactive}
      aria-busy={pending || undefined}
      whileHover={inactive ? undefined : { y: -1 }}
      whileTap={inactive ? undefined : { scale: 0.985 }}
      {...props}
    >
      {pending ? pendingLabel : children}
    </motion.button>
  );
}
