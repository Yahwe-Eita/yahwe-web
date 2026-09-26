import { describe, expect, it } from "vitest";
import { GET as home } from "@/app/api/home/route";
import { DELETE as deleteProfile } from "@/app/api/profile/route";
import { POST as logout } from "@/app/api/auth/logout/route";
import { getSession, writeSession } from "@/lib/server/session";
import { fakeUpstream, sameOriginRequest } from "../../../../tests/upstream";

const session = {
  accessToken: "expired-access",
  refreshToken: "refresh-1",
  user: { id: "u-5", name: "Ama Mensah", email: "ama@example.com" },
};

const renewed = {
  accessToken: "fresh-access",
  refreshToken: "refresh-2",
  expiresIn: 86400,
  user: { id: 5, userId: "u-5", name: "Ama Mensah", email: "ama@example.com" },
};

const homeData = { airtimeBalance: "50.00", cashEarned: "0.00", level: 1, totalRecruits: 0, user: { recruits: [] } };

describe("session refresh", () => {
  it("refreshes an expired access token once and retries", async () => {
    await writeSession(session);
    const calls = fakeUpstream((call) => {
      if (call.path === "/home") {
        return call.token === "Bearer fresh-access"
          ? { body: { status: true, data: homeData } }
          : { status: 401, body: { message: "Invalid or expired token" } };
      }
      if (call.path === "/auth/refresh") return { body: { status: true, data: renewed } };
      throw new Error(`unexpected ${call.path}`);
    });

    const response = await home();
    expect(response.status).toBe(200);
    expect(calls.map((c) => c.path)).toEqual(["/home", "/auth/refresh", "/home"]);
    expect(calls[1].body).toEqual({ refreshToken: "refresh-1" });
    expect((await getSession())?.refreshToken).toBe("refresh-2");
  });

  it("shares one refresh between simultaneous requests", async () => {
    await writeSession({ ...session, refreshToken: "refresh-shared" });
    const calls = fakeUpstream((call) => {
      if (call.path === "/home") {
        return call.token === "Bearer fresh-access"
          ? { body: { status: true, data: homeData } }
          : { status: 401, body: { message: "expired" } };
      }
      if (call.path === "/auth/refresh") return { body: { status: true, data: renewed } };
      throw new Error(`unexpected ${call.path}`);
    });

    const [a, b] = await Promise.all([home(), home()]);
    expect([a.status, b.status]).toEqual([200, 200]);
    expect(calls.filter((c) => c.path === "/auth/refresh")).toHaveLength(1);
  });

  it("ends the session when the refresh token is rejected", async () => {
    await writeSession({ ...session, refreshToken: "refresh-revoked" });
    fakeUpstream((call) =>
      call.path === "/auth/refresh" ? { status: 401, body: { message: "Invalid refresh token" } } : { status: 401, body: { message: "expired" } },
    );

    const response = await home();
    expect(response.status).toBe(401);
    expect(await getSession()).toBeNull();
  });

  it("hides upstream server errors from the member", async () => {
    await writeSession({ ...session, accessToken: "ok" });
    fakeUpstream(() => ({ status: 502, body: { message: "Phone verification failed: <hubtel raw body with POS 12345>" } }));
    const response = await home();
    expect(response.status).toBe(502);
    expect(JSON.stringify(await response.json())).not.toContain("hubtel");
  });
});

describe("account actions", () => {
  it("keeps the session when the account was not actually deleted", async () => {
    await writeSession({ ...session, accessToken: "ok" });
    fakeUpstream(() => ({ body: { status: false, message: "Account deletion is not available." } }));
    const response = await deleteProfile(sameOriginRequest("/api/profile", { method: "DELETE" }));
    expect(response.status).toBe(409);
    expect(await getSession()).not.toBeNull();
  });

  it("revokes the refresh token upstream on logout", async () => {
    await writeSession({ ...session, accessToken: "ok" });
    const calls = fakeUpstream(() => ({ body: { status: true } }));
    const response = await logout(sameOriginRequest("/api/auth/logout"));
    expect(response.status).toBe(200);
    expect(calls).toEqual([expect.objectContaining({ path: "/auth/logout", body: { refreshToken: "refresh-1" } })]);
    expect(await getSession()).toBeNull();
  });
});
