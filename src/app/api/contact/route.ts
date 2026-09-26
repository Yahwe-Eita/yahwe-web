import { assertSameOrigin, errorResponse, RequestError } from "@/lib/server/request";
import { emailField, ghanaPhoneField, isRecord, textField } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const input: unknown = await request.json();
    if (!isRecord(input)) throw new RequestError("Invalid contact request.", 400);

    const message = {
      firstName: textField(input.firstName, "First name", { max: 100 }),
      lastName: textField(input.lastName, "Last name", { max: 100 }),
      email: emailField(input.email),
      phone: `+${ghanaPhoneField(input.phone).international}`,
      message: textField(input.message, "Message", { max: 2000 }),
    };

    const webhookUrl = process.env.CONTACT_WEBHOOK_URL?.trim();
    if (!webhookUrl) {
      throw new RequestError("Messages cannot be sent right now.", 503);
    }

    let response: Response;
    try {
      response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message),
        cache: "no-store",
      });
    } catch {
      throw new RequestError("Messages cannot be sent right now.", 503);
    }

    if (!response.ok) {
      console.error("[Contact webhook]", response.status);
      throw new RequestError("Your message was not sent. Please try again.", 502);
    }

    return Response.json({ sent: true });
  } catch (error) {
    return errorResponse(error);
  }
}
