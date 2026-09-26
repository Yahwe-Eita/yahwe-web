import { describe, expect, it } from "vitest";
import { clientAddress, limits, rateLimit } from "@/lib/server/rate-limit";

function from(address: string) {
  return new Request("http://localhost/api/x", { headers: { "x-real-ip": address } });
}

describe("rateLimit", () => {
  it("allows the limit then refuses, per address", () => {
    const { limit } = limits.fee;
    for (let i = 0; i < limit; i += 1) rateLimit(from("10.0.0.1"), "fee");
    expect(() => rateLimit(from("10.0.0.1"), "fee")).toThrow(/Too many attempts/);
    expect(() => rateLimit(from("10.0.0.2"), "fee")).not.toThrow();
  });

  it("trusts the proxy-set address over client-supplied forwarding hops", () => {
    const spoofed = new Request("http://localhost", { headers: { "x-forwarded-for": "1.1.1.1, 203.0.113.9" } });
    expect(clientAddress(spoofed)).toBe("203.0.113.9");
  });
});
