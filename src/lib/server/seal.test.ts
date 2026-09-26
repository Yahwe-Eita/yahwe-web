import { afterEach, describe, expect, it, vi } from "vitest";
import { HttpError } from "@/lib/http-error";
import { seal, unseal } from "@/lib/server/seal";

describe("seal", () => {
  afterEach(() => vi.useRealTimers());

  it("round-trips a value for the same purpose", () => {
    const token = seal("session", { id: 7 }, 60);
    expect(unseal("session", token)).toEqual({ id: 7 });
  });

  it("will not open a token sealed for another purpose", () => {
    const token = seal("registration", { id: 7 }, 60);
    expect(unseal("session", token)).toBeNull();
  });

  it("rejects tampered and expired tokens", () => {
    vi.useFakeTimers();
    const token = seal("session", { id: 7 }, 60);
    const tampered = `${token.slice(0, -2)}${token.endsWith("A") ? "B" : "A"}A`;
    expect(unseal("session", tampered)).toBeNull();
    vi.advanceTimersByTime(61_000);
    expect(unseal("session", token)).toBeNull();
  });

  it("refuses to run without a strong secret", () => {
    const secret = process.env.SESSION_SECRET;
    process.env.SESSION_SECRET = "short";
    try {
      expect(() => seal("session", {}, 60)).toThrow(HttpError);
    } finally {
      process.env.SESSION_SECRET = secret;
    }
  });
});
