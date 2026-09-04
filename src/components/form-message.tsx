"use client";

import { AnimatePresence, motion } from "motion/react";

export function FormMessage({
  message,
  tone = "error",
}: {
  message?: string;
  tone?: "error" | "success" | "info";
}) {
  return (
    <AnimatePresence initial={false}>
      {message ? (
        <motion.p
          className={`form-message form-message-${tone}`}
          role="status"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -3 }}
        >
          {message}
        </motion.p>
      ) : null}
    </AnimatePresence>
  );
}
