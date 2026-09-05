import type { ApiEnvelope } from "@/lib/api/types";
import { apiRequest } from "@/lib/api/upstream";
import { setRegistration } from "@/lib/server/registration";
import { errorResponse } from "@/lib/server/request";
import { ghanaPhoneField } from "@/lib/validation";

interface SponsorResponse {
  accessToken?: string;
  id?: number;
  name?: string;
  phone?: string;
}

export async function GET(request: Request) {
  try {
    const phone = ghanaPhoneField(new URL(request.url).searchParams.get("phone"));
    const query = new URLSearchParams({ phone: phone.international });
    const response = await apiRequest<ApiEnvelope<SponsorResponse>>(`/sponsor?${query}`);
    const sponsor = response.data;

    if (!sponsor?.id || !sponsor.name) {
      return Response.json(
        { message: response.message ?? "No registered member with this number" },
        { status: 404 },
      );
    }

    await setRegistration({
      sponsorId: sponsor.id,
      sponsorName: sponsor.name,
      sponsorPhone: sponsor.phone ?? phone.international,
      accessToken: sponsor.accessToken,
    });

    return Response.json({
      sponsor: { name: sponsor.name, phone: sponsor.phone ?? phone.international },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
