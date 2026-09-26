import "server-only";

import { HttpError } from "@/lib/http-error";
import { isRecord } from "@/lib/validation";

const MAX_BODY_BYTES = 16_384;

function firstValue(header: string | null) {
  return header?.split(",")[0]?.trim() || undefined;
}

/** The origin the browser used: behind the reverse proxy the server itself only sees its internal address. */
export function publicOrigin(request: Request) {
  const url = new URL(request.url);
  const host = firstValue(request.headers.get("x-forwarded-host")) ?? request.headers.get("host");
  if (!host) return url.origin;
  const protocol = firstValue(request.headers.get("x-forwarded-proto")) ?? url.protocol.replace(":", "");
  return `${protocol}://${host}`;
}

export function assertSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (origin) {
    if (origin !== publicOrigin(request)) {
      throw new HttpError("Invalid request origin.", 403);
    }
    return;
  }
  if (request.headers.get("sec-fetch-site") !== "same-origin") {
    throw new HttpError("Invalid request origin.", 403);
  }
}

export async function readJson(request: Request) {
  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > MAX_BODY_BYTES) throw new HttpError("The request is too large.", 413);

  const text = await request.text();
  if (Buffer.byteLength(text) > MAX_BODY_BYTES) {
    throw new HttpError("The request is too large.", 413);
  }

  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    throw new HttpError("Invalid request.", 400);
  }
  if (!isRecord(value)) throw new HttpError("Invalid request.", 400);
  return value;
}

export function json<T>(body: T, init?: ResponseInit) {
  return Response.json(body, init);
}

export function errorResponse(error: unknown) {
  if (error instanceof HttpError) {
    return Response.json({ message: error.message }, { status: error.status });
  }
  console.error("[Yahwe API route]", error);
  return Response.json(
    { message: "Something went wrong. Please try again." },
    { status: 500 },
  );
}
