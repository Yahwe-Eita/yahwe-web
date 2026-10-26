import { beforeEach, describe, expect, it } from "vitest";
import { POST as requestReset } from "@/app/api/reset-password/route";
import { POST as resendReset } from "@/app/api/reset-password/resend/route";
import { POST as changePassword } from "@/app/api/password/change/route";
import { fakeUpstream, sameOriginRequest } from "../../../../tests/upstream";

let ip = 0;
function request(path: string, body?: unknown) {
  const req = sameOriginRequest(path, { body });
  req.headers.set("x-real-ip", `198.51.100.${(ip += 1) % 250}`);
  return req;
}

beforeEach(() => {
  ip += 1;
});

describe("password reset", () => {
  it("sends the email lowercased and returns the pinId", async () => {
    const calls = fakeUpstream(() => ({ body: { status: true, message: "sent", pinId: "pin-1" } }));
    const response = await requestReset(request("/api/reset-password", { email: " Ama@Example.com " }));

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ pinId: "pin-1" });
    expect(calls).toMatchObject([{ path: "/reset-password", body: { email: "ama@example.com" } }]);
  });

  it("resends the code for the same pinId", async () => {
    const calls = fakeUpstream(() => ({ body: { status: true, message: "sent", pinId: "pin-1" } }));
    const response = await resendReset(request("/api/reset-password/resend", { pinId: "pin-1" }));

    expect(response.status).toBe(200);
    expect(calls).toMatchObject([{ path: "/password/resend", body: { pinId: "pin-1" } }]);
  });

  it("reports a resend the API could not send", async () => {
    fakeUpstream(() => ({ status: 502, body: { status: false, message: "Failed to send OTP" } }));
    const response = await resendReset(request("/api/reset-password/resend", { pinId: "pin-1" }));

    expect(response.status).toBeGreaterThanOrEqual(500);
  });

  it("passes the code and new password to the API", async () => {
    const calls = fakeUpstream(() => ({ body: { status: true, message: "Password changed successfully" } }));
    const response = await changePassword(
      request("/api/password/change", { pinId: "pin-1", code: "123456", newPassword: "Str0ng!pass" }),
    );

    expect(response.status).toBe(200);
    expect(calls).toMatchObject([
      { path: "/password/change", body: { pinId: "pin-1", code: "123456", newPassword: "Str0ng!pass" } },
    ]);
  });
});
