"use client";

import { useEffect, useState } from "react";

/** Milliseconds left until the deadline, ticking every second; null when there is no valid deadline. */
export function useCountdown(deadline: string | undefined) {
  const target = deadline ? new Date(deadline).getTime() : Number.NaN;
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!Number.isFinite(target)) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [target]);

  return Number.isFinite(target) ? target - now : null;
}
