import "server-only";

import { createCipheriv, createDecipheriv, hkdfSync, randomBytes } from "node:crypto";
import { HttpError } from "@/lib/http-error";

export type SealPurpose = "session" | "registration";

interface Envelope<T> {
  value: T;
  expiresAt: number;
}

function key(purpose: SealPurpose) {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new HttpError("The service is temporarily unavailable. Please try again.", 503);
  }
  return Buffer.from(hkdfSync("sha256", secret, "", `yahwe-web:${purpose}`, 32));
}

export function seal<T>(purpose: SealPurpose, value: T, maxAgeSeconds: number): string {
  const envelope: Envelope<T> = { value, expiresAt: Date.now() + maxAgeSeconds * 1000 };
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(purpose), iv, { authTagLength: 16 });
  cipher.setAAD(Buffer.from(purpose));
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(envelope), "utf8"),
    cipher.final(),
  ]);
  return Buffer.concat([iv, cipher.getAuthTag(), encrypted]).toString("base64url");
}

export function unseal<T>(purpose: SealPurpose, token?: string): T | null {
  if (!token) return null;
  const secretKey = key(purpose);

  let envelope: Envelope<T>;
  try {
    const input = Buffer.from(token, "base64url");
    const decipher = createDecipheriv("aes-256-gcm", secretKey, input.subarray(0, 12), {
      authTagLength: 16,
    });
    decipher.setAAD(Buffer.from(purpose));
    decipher.setAuthTag(input.subarray(12, 28));
    const decrypted = Buffer.concat([
      decipher.update(input.subarray(28)),
      decipher.final(),
    ]).toString("utf8");
    envelope = JSON.parse(decrypted) as Envelope<T>;
  } catch {
    return null;
  }

  return envelope.expiresAt > Date.now() ? envelope.value : null;
}
