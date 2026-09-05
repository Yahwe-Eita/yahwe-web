"use client";

import { useCountdown } from "@/hooks/useCountdown";

function formatRemaining(milliseconds: number) {
  if (milliseconds <= 0) return "00d 00h 00m 00s";
  const seconds = Math.floor(milliseconds / 1000);
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainder = seconds % 60;
  return `${days}d ${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(remainder).padStart(2, "0")}s`;
}

export function Countdown({
  deadline,
  activeLabel,
  expiredLabel,
}: {
  deadline?: string;
  activeLabel: string;
  expiredLabel: string;
}) {
  const { isAvailable, remaining } = useCountdown(deadline, 0);
  if (!isAvailable) return null;
  return (
    <>
      <span>{remaining <= 0 ? expiredLabel : `${activeLabel}:`}</span>
      {remaining > 0 ? <strong>{formatRemaining(remaining)}</strong> : null}
    </>
  );
}
