import "server-only";

export class RequestError extends Error {
  public readonly expose = true;

  constructor(message: string, public readonly status: number) {
    super(message);
  }
}

export function assertSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    throw new RequestError("Invalid request origin.", 403);
  }
}

export function errorResponse(error: unknown) {
  const status =
    error instanceof Error &&
    "status" in error &&
    typeof error.status === "number"
      ? error.status
      : 500;
  const expose =
    error instanceof Error &&
    "expose" in error &&
    error.expose === true;
  const message =
    expose && error instanceof Error
      ? error.message
      : "The request could not be completed.";

  return Response.json({ message }, { status });
}
