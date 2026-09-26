import { describe, expect, it } from "vitest";
import { formatCurrency, formatDateTime, formatRelativeTime } from "@/lib/format";

describe("formatCurrency", () => {
  it("formats API decimal strings as cedis, rounding only here", () => {
    expect(formatCurrency("150.00")).toBe(formatCurrency("150"));
    expect(formatCurrency("98370.00")).toContain("98,370.00");
    expect(formatCurrency("10.12345")).toContain("10.12");
  });

  it("renders a dash for missing or malformed amounts", () => {
    expect(formatCurrency(undefined)).toBe("-");
    expect(formatCurrency("")).toBe("-");
    expect(formatCurrency("abc")).toBe("-");
  });
});

describe("dates", () => {
  it("renders a dash for missing or invalid dates", () => {
    expect(formatDateTime(undefined)).toBe("-");
    expect(formatDateTime("nope")).toBe("-");
    expect(formatRelativeTime("nope")).toBe("-");
  });

  it("describes elapsed time", () => {
    const now = Date.parse("2026-09-26T12:00:00Z");
    expect(formatRelativeTime("2026-09-26T09:00:00Z", now)).toBe("3 hours ago");
  });
});
