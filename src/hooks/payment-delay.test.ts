import { describe, expect, it } from "vitest";
import { MAX_STATUS_CHECKS, statusCheckDelay } from "@/hooks/usePaymentStatus";

describe("statusCheckDelay", () => {
  it("starts at 5 seconds, grows, and caps at 20", () => {
    expect(statusCheckDelay(0)).toBe(5);
    expect(statusCheckDelay(1)).toBe(7);
    expect(statusCheckDelay(MAX_STATUS_CHECKS)).toBe(20);
  });
});
