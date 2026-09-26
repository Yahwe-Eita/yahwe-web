import type { RegistrationResult } from "@/lib/api/types";
import { completeRegistration, requireRegistration } from "@/lib/server/registration";
import { assertSameOrigin, errorResponse, json } from "@/lib/server/request";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const user = await completeRegistration(await requireRegistration());
    return json<RegistrationResult>({ status: "complete", user });
  } catch (error) {
    return errorResponse(error);
  }
}
