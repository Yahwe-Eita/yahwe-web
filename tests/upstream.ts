import { vi } from "vitest";

export interface UpstreamCall {
  method: string;
  path: string;
  body: unknown;
  token: string | null;
}

type Handler = (call: UpstreamCall) => { status?: number; body: unknown };

/** Replaces fetch with a fake upstream API and records every call made to it. */
export function fakeUpstream(handler: Handler) {
  const calls: UpstreamCall[] = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: string | URL, init?: RequestInit) => {
      const url = new URL(String(input));
      const headers = new Headers(init?.headers);
      const call: UpstreamCall = {
        method: init?.method ?? "GET",
        path: `${url.pathname.replace(/^\/api/, "")}${url.search}`,
        body: init?.body ? JSON.parse(String(init.body)) : undefined,
        token: headers.get("Authorization"),
      };
      calls.push(call);
      const { status = 200, body } = handler(call);
      return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
    }),
  );
  return calls;
}

export function sameOriginRequest(path: string, init: { method?: string; body?: unknown } = {}) {
  return new Request(`http://localhost${path}`, {
    method: init.method ?? "POST",
    headers: { origin: "http://localhost", "content-type": "application/json" },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  });
}
