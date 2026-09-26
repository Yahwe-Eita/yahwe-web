"use client";

import { motion, type HTMLMotionProps } from "motion/react";

interface SubmitButtonProps extends HTMLMotionProps<"button"> {
  pending?: boolean;
  pendingLabel: string;
}

export function SubmitButton({
  children,
  pending,
  pendingLabel,
  className = "",
  disabled,
  ...props
}: SubmitButtonProps) {
  const inactive = disabled || pending;
  return (
    <motion.button
      className={`submit-button ${className}`}
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
