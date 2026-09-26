"use client";

import { useCountdown } from "@/hooks/useCountdown";

function formatRemaining(milliseconds: number) {
  const seconds = Math.floor(milliseconds / 1000);
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const rest = seconds % 60;
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${days}d ${pad(hours)}h ${pad(minutes)}m ${pad(rest)}s`;
}

export function Countdown({
  deadline,
  activeLabel,
  expiredLabel,
}: {
  deadline: string;
  activeLabel: string;
  expiredLabel: string;
}) {
  const remaining = useCountdown(deadline);
  if (remaining === null) return null;
  if (remaining <= 0) return <span>{expiredLabel}</span>;
  return (
    <>
      <span>{activeLabel}</span>
      <strong>
        <time dateTime={deadline}>{formatRemaining(remaining)}</time>
      </strong>
    </>
  );
}
