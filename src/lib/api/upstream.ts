import "server-only";

import { HttpError } from "@/lib/http-error";

const UPSTREAM_TIMEOUT_MS = 20_000;
const UNAVAILABLE = "The service is temporarily unavailable. Please try again.";

interface ApiRequestOptions extends RequestInit {
  token?: string;
}

function baseUrl() {
  const configured = process.env.YAHWE_API_URL?.trim();
  if (!configured) throw new HttpError(UNAVAILABLE, 503);

  let url: URL;
  try {
    url = new URL(configured);
  } catch {
    throw new HttpError(UNAVAILABLE, 503);
  }
  if (url.protocol !== "https:" && process.env.NODE_ENV === "production") {
    throw new HttpError(UNAVAILABLE, 503);
  }
  return configured.replace(/\/$/, "");
}

function upstreamMessage(body: unknown) {
  return typeof body === "object" && body !== null && "message" in body
    ? String(body.message)
    : undefined;
}

export async function apiRequest<T>(
  path: string,
  { token, headers, ...init }: ApiRequestOptions = {},
): Promise<T> {
  const url = `${baseUrl()}/${path.replace(/^\//, "")}`;
  const requestHeaders = new Headers(headers);
  requestHeaders.set("Accept", "application/json");
  if (init.body && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }
  if (token) requestHeaders.set("Authorization", `Bearer ${token}`);

  let response: Response;
  try {
    response = await fetch(url, {
      ...init,
      headers: requestHeaders,
      cache: "no-store",
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });
  } catch (error) {
    console.error("[Upstream unreachable]", path.split("?")[0], error);
    throw new HttpError(UNAVAILABLE, 503);
  }

  const text = await response.text();
  let body: unknown = null;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = null;
    }
  }

  if (!response.ok) {
    const message = upstreamMessage(body);
    if (response.status >= 500) {
      console.error("[Upstream error]", path.split("?")[0], response.status, message);
      throw new HttpError(UNAVAILABLE, 502);
    }
    throw new HttpError(message ?? "The request could not be completed.", response.status);
  }

  return body as T;
}
