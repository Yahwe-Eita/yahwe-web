import { describe, expect, it } from "vitest";
import { HttpError } from "@/lib/http-error";
import { assertSameOrigin, errorResponse, readJson } from "@/lib/server/request";

function request(headers: Record<string, string>, body?: string) {
  return new Request("http://localhost/api/x", { method: "POST", headers, body });
}

describe("assertSameOrigin", () => {
  it("accepts same-origin requests", () => {
    expect(() => assertSameOrigin(request({ origin: "http://localhost" }))).not.toThrow();
    expect(() => assertSameOrigin(request({ "sec-fetch-site": "same-origin" }))).not.toThrow();
  });

  it("rejects cross-origin requests and requests with no origin evidence", () => {
    expect(() => assertSameOrigin(request({ origin: "https://evil.example" }))).toThrow(HttpError);
    expect(() => assertSameOrigin(request({}))).toThrow(HttpError);
    expect(() => assertSameOrigin(request({ "sec-fetch-site": "cross-site" }))).toThrow(HttpError);
  });
});

describe("readJson", () => {
  it("parses an object body", async () => {
    await expect(readJson(request({}, JSON.stringify({ a: 1 })))).resolves.toEqual({ a: 1 });
  });

  it("rejects oversized, malformed and non-object bodies", async () => {
    await expect(readJson(request({}, "x".repeat(20_000)))).rejects.toMatchObject({ status: 413 });
    await expect(readJson(request({}, "{"))).rejects.toMatchObject({ status: 400 });
    await expect(readJson(request({}, "[1]"))).rejects.toMatchObject({ status: 400 });
  });
});

describe("errorResponse", () => {
  it("passes our own messages through and hides unexpected errors", async () => {
    const known = errorResponse(new HttpError("Nope.", 409));
    expect(known.status).toBe(409);
    expect(await known.json()).toEqual({ message: "Nope." });

    const unknown = errorResponse(new Error("database password is wrong"));
    expect(unknown.status).toBe(500);
    expect(JSON.stringify(await unknown.json())).not.toContain("password");
  });
});
