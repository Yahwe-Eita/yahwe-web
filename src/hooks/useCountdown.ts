"use client";

import { useEffect, useMemo, useState } from "react";

export function useCountdown(createdAt: string | undefined, days: number) {
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

  return {
    isAvailable: Number.isFinite(target),
    remaining,
  };
}
