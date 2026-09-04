import "server-only";

import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "node:crypto";

const DEVELOPMENT_SECRET = "yahwe-eita-local-development-only";

function key() {
  const secret = process.env.SESSION_SECRET;

  if (process.env.NODE_ENV === "production" && (!secret || secret.length < 32)) {
    throw new Error(
      "SESSION_SECRET must contain at least 32 characters in production.",
    );
  }

  return createHash("sha256")
    .update(secret ?? DEVELOPMENT_SECRET)
    .digest();
}

export function seal<T>(value: T): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(value), "utf8"),
    cipher.final(),
  ]);

  return Buffer.concat([iv, cipher.getAuthTag(), encrypted]).toString(
    "base64url",
  );
}

export function unseal<T>(value?: string): T | null {
  if (!value) return null;

  try {
    const input = Buffer.from(value, "base64url");
    const iv = input.subarray(0, 12);
    const authTag = input.subarray(12, 28);
    const encrypted = input.subarray(28);
    const decipher = createDecipheriv("aes-256-gcm", key(), iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]).toString("utf8");

    return JSON.parse(decrypted) as T;
  } catch {
    return null;
  }
}
