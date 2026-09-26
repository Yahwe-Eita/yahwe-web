import type { SuccessResult } from "@/lib/api/types";
import { HttpError } from "@/lib/http-error";
import { rateLimit } from "@/lib/server/rate-limit";
import { assertSameOrigin, errorResponse, json, readJson } from "@/lib/server/request";
import { emailField, ghanaPhoneField, textField } from "@/lib/validation";

const UNAVAILABLE = "Messages cannot be sent right now. Please use WhatsApp or email.";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    rateLimit(request, "contact");
    const input = await readJson(request);
    const message = {
      firstName: textField(input.firstName, "First name", { max: 100 }),
      lastName: textField(input.lastName, "Last name", { max: 100 }),
      email: emailField(input.email),
      phone: `+${ghanaPhoneField(input.phone).international}`,
      message: textField(input.message, "Message", { max: 2000 }),
    };

    const webhookUrl = process.env.CONTACT_WEBHOOK_URL?.trim();
    if (!webhookUrl) throw new HttpError(UNAVAILABLE, 503);

    let response: Response;
    try {
      response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message),
        cache: "no-store",
        signal: AbortSignal.timeout(15_000),
      });
    } catch (error) {
      console.error("[Contact webhook unreachable]", error);
      throw new HttpError(UNAVAILABLE, 503);
    }
    if (!response.ok) {
      console.error("[Contact webhook]", response.status);
      throw new HttpError(UNAVAILABLE, 502);
    }
    return json<SuccessResult>({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
