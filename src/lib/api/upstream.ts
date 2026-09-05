import "server-only";

export class UpstreamError extends Error {
  public readonly expose = true;

  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "UpstreamError";
  }
}

interface ApiRequestOptions extends RequestInit {
  token?: string;
}

export async function apiRequest<T>(
  path: string,
  { token, headers, ...init }: ApiRequestOptions = {},
): Promise<T> {
  const baseUrl = process.env.YAHWE_API_URL?.trim();
  if (!baseUrl) {
    throw new UpstreamError("The server API connection is not configured.", 503);
  }

  let url: URL;
  try {
    url = new URL(`${baseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`);
  } catch {
    throw new UpstreamError("The server API connection is not configured.", 503);
  }

  if (url.protocol !== "https:" && process.env.NODE_ENV === "production") {
    throw new UpstreamError("The server API connection is not configured.", 503);
  }
  const requestHeaders = new Headers(headers);

  requestHeaders.set("Accept", "application/json");
  if (init.body && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }
  if (token) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(url, {
      ...init,
      headers: requestHeaders,
      cache: "no-store",
    });
  } catch {
    throw new UpstreamError(
      "The service is temporarily unreachable. Please try again.",
      503,
    );
  }

  const text = await response.text();
  let body: unknown = null;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = { message: text };
    }
  }

  if (!response.ok) {
    const message =
      typeof body === "object" && body !== null && "message" in body
        ? String(body.message)
        : "The request could not be completed.";
    throw new UpstreamError(message, response.status);
  }

  return body as T;
}
