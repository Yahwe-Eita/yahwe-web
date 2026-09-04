"use client";

import { useEffect, useMemo, useState } from "react";

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
  createdAt,
  days,
}: {
  createdAt?: string;
  days: number;
}) {
  const target = useMemo(() => {
    const created = createdAt ? new Date(createdAt).getTime() : Number.NaN;
    return created + days * 24 * 60 * 60 * 1000;
  }, [createdAt, days]);
  const [remaining, setRemaining] = useState(() => target - Date.now());

  useEffect(() => {
    const update = () => setRemaining(target - Date.now());
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [target]);

  if (!Number.isFinite(target)) return <span>Unavailable</span>;
  return <span>{formatRemaining(remaining)}</span>;
}
