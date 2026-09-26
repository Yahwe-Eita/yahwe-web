import "server-only";

import { HttpError } from "@/lib/http-error";

interface Window {
  count: number;
  resetAt: number;
}

const windows = new Map<string, Window>();
const MAX_TRACKED = 10_000;

export const limits = {
  login: { limit: 10, windowMs: 15 * 60_000 },
  resetPassword: { limit: 5, windowMs: 60 * 60_000 },
  sponsor: { limit: 20, windowMs: 15 * 60_000 },
  phoneLookup: { limit: 5, windowMs: 15 * 60_000 },
  codeCheck: { limit: 10, windowMs: 15 * 60_000 },
  fee: { limit: 5, windowMs: 15 * 60_000 },
  contact: { limit: 5, windowMs: 60 * 60_000 },
} as const;

/** The reverse proxy sets X-Real-IP; the last X-Forwarded-For hop is the one it appended. */
export function clientAddress(request: Request) {
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  const forwarded = request.headers.get("x-forwarded-for")?.split(",");
  return forwarded?.[forwarded.length - 1]?.trim() || "unknown";
}

function prune(now: number) {
  for (const [key, window] of windows) {
    if (window.resetAt <= now) windows.delete(key);
  }
}

/** Fixed-window limit held in this server's memory. */
export function rateLimit(request: Request, scope: keyof typeof limits) {
  const { limit, windowMs } = limits[scope];
  const now = Date.now();
  if (windows.size > MAX_TRACKED) prune(now);

  const key = `${scope}:${clientAddress(request)}`;
  const current = windows.get(key);
  if (!current || current.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }
  current.count += 1;
  if (current.count > limit) {
    throw new HttpError("Too many attempts. Please wait a few minutes and try again.", 429);
  }
}
