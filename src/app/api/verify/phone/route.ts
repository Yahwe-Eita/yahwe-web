import type { ApiEnvelope, PhoneVerificationResult } from "@/lib/api/types";
import { apiRequest } from "@/lib/api/upstream";
import { HttpError } from "@/lib/http-error";
import { MOMO_CHANNEL, requireRegistration, setRegistration } from "@/lib/server/registration";
import { assertSameOrigin, errorResponse, json, readJson } from "@/lib/server/request";
import { ghanaPhoneField } from "@/lib/validation";
import { rateLimit } from "@/lib/server/rate-limit";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    rateLimit(request, "phoneLookup");
    const state = await requireRegistration();
    if (state.feeReference) {
      throw new HttpError("A payment is already in progress for this registration.", 409);
    }
    const phone = ghanaPhoneField((await readJson(request)).phone);

    const lookup = await apiRequest<ApiEnvelope<{ name?: string }>>(
      `/verify?${new URLSearchParams({ type: "phone", id: phone.local, provider: MOMO_CHANNEL })}`,
    );
    if (lookup.accountExists) {
      return json<PhoneVerificationResult>({ accountExists: true });
    }
    const name = lookup.data?.name;
    if (!name) throw new HttpError("This Mobile Money number could not be found.", 404);

    const otp = await apiRequest<ApiEnvelope<{ pinId: string }>>("/otp/send", {
      method: "POST",
      body: JSON.stringify({ phone: phone.international }),
    });
    const pinId = otp.data?.pinId;
    if (!pinId) throw new HttpError("The code could not be sent. Please try again.", 502);

    await setRegistration({
      sponsorId: state.sponsorId,
      sponsorName: state.sponsorName,
      sponsorPhone: state.sponsorPhone,
      candidate: { name, phone: phone.international, pinId },
    });
    return json<PhoneVerificationResult>({ accountExists: false, name, phone: phone.international });
  } catch (error) {
    return errorResponse(error);
  }
}
