"use client";

import { motion } from "motion/react";

export function AnimatedProgress({ value }: { value: number }) {
  const width = `${Math.min(Math.max(value, 0), 100)}%`;

  return (
    <motion.span
      initial={{ width: 0 }}
      animate={{ width }}
      transition={{ duration: 0.65, delay: 0.18 }}
    />
  );
}
