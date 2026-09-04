"use client";

import { motion, type HTMLMotionProps } from "motion/react";

interface SubmitButtonProps extends HTMLMotionProps<"button"> {
  pending?: boolean;
  pendingLabel?: string;
}

export function SubmitButton({
  children,
  pending,
  pendingLabel = "Please wait…",
  className = "",
  disabled,
  ...props
}: SubmitButtonProps) {
  return (
    <motion.button
      className={`submit-button ${className}`}
      disabled={disabled || pending}
      whileHover={disabled || pending ? undefined : { y: -1 }}
      whileTap={disabled || pending ? undefined : { scale: 0.985 }}
      {...props}
    >
      {pending ? pendingLabel : children}
    </motion.button>
  );
}
