import { beforeEach, describe, expect, it } from "vitest";
import { POST as sponsor } from "@/app/api/sponsor/route";
import { POST as verifyPhone } from "@/app/api/verify/phone/route";
import { POST as verifyCode } from "@/app/api/verify/code/route";
import { POST as register } from "@/app/api/auth/register/route";
import { POST as startFee } from "@/app/api/fee/route";
import { GET as feeStatus } from "@/app/api/fee/status/route";
import { getRegistration, setRegistration, type RegistrationState } from "@/lib/server/registration";
import { getSession } from "@/lib/server/session";
import { fakeUpstream, sameOriginRequest } from "../../../../tests/upstream";

const auth = {
  accessToken: "access-1",
  refreshToken: "refresh-1",
  expiresIn: 86400,
  user: { id: 5, userId: "u-5", name: "Ama Mensah", email: "ama@example.com" },
};

const pending = {
  fullName: "Ama Mensah",
  email: "ama@example.com",
  password: "Str0ng!pass",
  phone: "233241234567",
  dateOfBirth: "1990-01-01",
  channel: "mtn-gh",
  sponsorId: 1,
  feeId: "",
  platform: "ANDROID" as const,
};

const base: RegistrationState = { sponsorId: 1, sponsorName: "Kofi", sponsorPhone: "233200000000" };

let ip = 0;
function request(path: string, body?: unknown) {
  const req = sameOriginRequest(path, { body });
  req.headers.set("x-real-ip", `192.0.2.${(ip += 1) % 250}`);
  return req;
}

beforeEach(() => {
  ip += 1;
});

describe("sponsor and phone ownership", () => {
  it("rejects a sponsor lookup from another site", async () => {
    const response = await sponsor(
      new Request("http://localhost/api/sponsor", { method: "POST", headers: { origin: "https://evil.example" }, body: "{}" }),
    );
    expect(response.status).toBe(403);
  });

  it("marks the phone verified only after the code is confirmed", async () => {
    await setRegistration(base);
    const calls = fakeUpstream((call) => {
      if (call.path.startsWith("/verify")) return { body: { status: true, data: { name: "Ama Mensah" } } };
      if (call.path === "/otp/send") return { body: { status: true, data: { pinId: "pin-1" } } };
      if (call.path.startsWith("/otp/verify")) return { body: { status: true, message: "OTP verified" } };
      throw new Error(`unexpected ${call.path}`);
    });

    const lookup = await verifyPhone(request("/api/verify/phone", { phone: "0241234567" }));
    expect(lookup.status).toBe(200);
    expect((await getRegistration())?.verifiedPhone).toBeUndefined();
    expect(calls.find((c) => c.path === "/otp/send")?.body).toEqual({ phone: "233241234567" });

    const confirmed = await verifyCode(request("/api/verify/code", { code: "123456" }));
    expect(confirmed.status).toBe(200);
    expect(calls.at(-1)?.path).toBe("/otp/verify?pinId=pin-1");
    const state = await getRegistration();
    expect(state?.verifiedPhone).toBe("233241234567");
    expect(state?.candidate).toBeUndefined();
  });

  it("will not take details before the phone is confirmed", async () => {
    await setRegistration({ ...base, candidate: { name: "Ama", phone: "233241234567", pinId: "p" } });
    fakeUpstream(() => {
      throw new Error("upstream must not be called");
    });
    const response = await register(request("/api/auth/register", { email: "a@b.co", password: "Str0ng!pass", dateOfBirth: "1990-01-01" }));
    expect(response.status).toBe(409);
  });
});

describe("fee payment", () => {
  it("reuses a pending charge instead of charging again", async () => {
    await setRegistration({ ...base, verifiedName: "Ama", verifiedPhone: "233241234567", pending, feeReference: "ref-1" });
    const calls = fakeUpstream((call) => {
      if (call.path === "/fee/status?reference=ref-1") return { body: { status: true, data: { reference: "ref-1", status: "PROCESSING" } } };
      throw new Error(`unexpected ${call.method} ${call.path}`);
    });

    const response = await startFee(request("/api/fee"));
    expect(await response.json()).toEqual({ outcome: "awaiting_payment" });
    expect(calls.some((c) => c.method === "POST" && c.path === "/fee")).toBe(false);
  });

  it("starts a new charge only after the previous one failed", async () => {
    await setRegistration({ ...base, verifiedName: "Ama", verifiedPhone: "233241234567", pending, feeReference: "ref-1" });
    const calls = fakeUpstream((call) => {
      if (call.path === "/fee/status?reference=ref-1") return { body: { status: true, data: { reference: "ref-1", status: "FAILED" } } };
      if (call.method === "POST" && call.path === "/fee") return { body: { status: true, data: { reference: "ref-2", status: "PENDING" } } };
      throw new Error(`unexpected ${call.method} ${call.path}`);
    });

    const response = await startFee(request("/api/fee"));
    expect(await response.json()).toEqual({ outcome: "awaiting_payment" });
    expect(calls.filter((c) => c.method === "POST" && c.path === "/fee")).toHaveLength(1);
    expect((await getRegistration())?.feeReference).toBe("ref-2");
  });

  it("completes registration when the fee is already paid", async () => {
    await setRegistration({ ...base, verifiedName: "Ama", verifiedPhone: "233241234567", pending, feeReference: "ref-1" });
    const calls = fakeUpstream((call) => {
      if (call.path === "/fee/status?reference=ref-1") return { body: { status: true, data: { reference: "ref-1", status: "COMPLETED" } } };
      if (call.path === "/auth/register?validate_only=false") return { status: 201, body: { status: true, data: auth } };
      throw new Error(`unexpected ${call.method} ${call.path}`);
    });

    const response = await startFee(request("/api/fee"));
    expect((await response.json()).outcome).toBe("registered");
    expect(calls.at(-1)?.body).toMatchObject({ feeId: "ref-1", phone: "233241234567" });
    expect((await getSession())?.user.id).toBe("u-5");
    expect(await getRegistration()).toBeNull();
  });

  it("checks only the reference held in the sealed registration", async () => {
    await setRegistration({ ...base, pending, feeReference: "ref-own" });
    const calls = fakeUpstream(() => ({ body: { status: true, data: { reference: "ref-own", status: "FAILED", failedReason: "Declined" } } }));

    await feeStatus();
    expect(calls[0].path).toBe("/fee/status?reference=ref-own");
    expect((await getRegistration())?.feeReference).toBe("ref-own");
  });

  it("reports a failed payment with its reason", async () => {
    await setRegistration({ ...base, pending, feeReference: "ref-own" });
    fakeUpstream(() => ({ body: { status: true, data: { reference: "ref-own", status: "FAILED", failedReason: "Declined by customer" } } }));
    const response = await feeStatus();
    expect(await response.json()).toEqual({ status: "FAILED", reason: "Declined by customer" });
  });
});
