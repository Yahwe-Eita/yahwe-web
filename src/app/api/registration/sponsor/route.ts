import type { ApiEnvelope } from "@/lib/api/types";
import { apiRequest } from "@/lib/api/upstream";
import { setRegistration } from "@/lib/server/registration";
import { assertSameOrigin, errorResponse } from "@/lib/server/request";
import { ghanaPhoneField, isRecord } from "@/lib/validation";

interface SponsorResponse {
  accessToken?: string;
  id?: number;
  name?: string;
  phone?: string;
}

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const input: unknown = await request.json();
    if (!isRecord(input)) throw new Error("Invalid sponsor request.");

    const phone = ghanaPhoneField(input.phone);
    const query = new URLSearchParams({ phone: phone.international });
    const response = await apiRequest<ApiEnvelope<SponsorResponse>>(
      `/sponsor?${query}`,
    );
    const sponsor = response.data;

    if (!sponsor?.id || !sponsor.accessToken || !sponsor.name) {
      return Response.json({ message: "Sponsor not found." }, { status: 404 });
    }

    await setRegistration({
      sponsorId: sponsor.id,
      sponsorName: sponsor.name,
      sponsorPhone: sponsor.phone ?? phone.international,
      accessToken: sponsor.accessToken,
    });

    return Response.json({
      sponsor: {
        name: sponsor.name,
        phone: sponsor.phone ?? phone.international,
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
