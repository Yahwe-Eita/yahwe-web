import type { ApiEnvelope, SponsorResult } from "@/lib/api/types";
import { apiRequest } from "@/lib/api/upstream";
import { HttpError } from "@/lib/http-error";
import { getRegistration, setRegistration } from "@/lib/server/registration";
import { assertSameOrigin, errorResponse, json, readJson } from "@/lib/server/request";
import { ghanaPhoneField } from "@/lib/validation";
import { rateLimit } from "@/lib/server/rate-limit";

interface UpstreamSponsor {
  id: number;
  name: string;
  phone: string;
}

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    rateLimit(request, "sponsor");
    const input = await readJson(request);
    const phone = ghanaPhoneField(input.phone);

    const existing = await getRegistration();
    if (existing?.feeReference) {
      throw new HttpError("A payment is already in progress for this registration.", 409);
    }

    const query = new URLSearchParams({ phone: phone.international });
    const response = await apiRequest<ApiEnvelope<UpstreamSponsor>>(`/sponsor?${query}`);
    const sponsor = response.data;
    if (!sponsor?.id || !sponsor.name) {
      throw new HttpError(response.message ?? "No registered member with this number.", 404);
    }

    await setRegistration({
      sponsorId: sponsor.id,
      sponsorName: sponsor.name,
      sponsorPhone: sponsor.phone,
    });
    return json<SponsorResult>({ sponsor: { name: sponsor.name, phone: sponsor.phone } });
  } catch (error) {
    return errorResponse(error);
  }
}
