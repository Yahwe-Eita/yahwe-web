"use client";

import { AnimatePresence, motion } from "motion/react";
import { messageClassName, type MessageTone } from "@/components/ui/notice";

export function FormMessage({
  message,
  tone = "error",
}: {
  message?: string;
  tone?: MessageTone;
}) {
  return (
    <div role={tone === "error" ? "alert" : "status"} className="form-message-region">
      <AnimatePresence initial={false}>
        {message ? (
          <motion.p
            className={messageClassName(tone)}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
          >
            {message}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
