import { describe, expect, it } from "vitest";
import { HttpError } from "@/lib/http-error";
import { dateField, ghanaPhoneField, localPhoneDigits, passwordField } from "@/lib/validation";

describe("localPhoneDigits", () => {
  it("drops a leading 0 or 233 and keeps at most 9 digits", () => {
    expect(localPhoneDigits("024 123 4567")).toBe("241234567");
    expect(localPhoneDigits("+233241234567")).toBe("241234567");
    expect(localPhoneDigits("2412345678")).toBe("241234567");
  });
});

describe("ghanaPhoneField", () => {
  it.each(["0241234567", "233241234567", "241234567", "+233 24 123 4567"])("accepts %s", (input) => {
    expect(ghanaPhoneField(input)).toEqual({ local: "241234567", international: "233241234567" });
  });

  it.each(["05412345678", "24123456", "2332412345678", "abc"])("rejects %s instead of truncating it", (input) => {
    expect(() => ghanaPhoneField(input)).toThrow(HttpError);
  });
});

describe("passwordField", () => {
  it("applies the same rules as the registration checklist", () => {
    expect(passwordField("Str0ng!pass")).toBe("Str0ng!pass");
    expect(() => passwordField("short1!")).toThrow("at least 8");
    expect(() => passwordField("nouppercase1!")).toThrow("uppercase");
  });
});

describe("dateField", () => {
  it("accepts real ISO dates only", () => {
    expect(dateField("1990-02-28")).toBe("1990-02-28");
    expect(() => dateField("1990-02-30")).toThrow(HttpError);
    expect(() => dateField("28/02/1990")).toThrow(HttpError);
  });
});
