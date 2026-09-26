import type { SuccessResult } from "@/lib/api/types";
import { sessionRequest } from "@/lib/server/api-session";
import { assertSameOrigin, errorResponse, json, readJson } from "@/lib/server/request";
import { ghanaPhoneField, textField } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const input = await readJson(request);
    const name = textField(input.name, "Name", { min: 2, max: 100 });
    const phone = ghanaPhoneField(input.phone);
    await sessionRequest("/invites", {
      method: "POST",
      body: JSON.stringify({ name, phone: phone.international }),
    });
    return json<SuccessResult>({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
