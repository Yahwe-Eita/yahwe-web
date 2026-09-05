import type { ApiEnvelope } from "@/lib/api/types";
import { apiRequest } from "@/lib/api/upstream";
import { getRegistration, setRegistration } from "@/lib/server/registration";
import { errorResponse } from "@/lib/server/request";
import { ghanaPhoneField, textField } from "@/lib/validation";

interface VerifyResponse {
  data?: { name?: string; dateOfBirth?: string };
  name?: string;
  dateOfBirth?: string;
}

export async function GET(request: Request) {
  try {
    const state = await getRegistration();
    if (!state) {
      return Response.json({ message: "Verify your sponsor before continuing." }, { status: 409 });
    }

    const params = new URL(request.url).searchParams;
    const type = params.get("type");

    if (type === "phone") {
      const phone = ghanaPhoneField(params.get("id"));
      const provider = params.get("provider") ?? "mtn-gh";
      const query = new URLSearchParams({ type, id: phone.local, provider });
      const response = await apiRequest<ApiEnvelope<VerifyResponse>>(`/verify?${query}`, {
        token: state.accessToken,
      });
      if (response.accountExists) {
        return Response.json({ accountExists: true });
      }
      if (!response.data?.name) {
        return Response.json({ message: "The Mobile Money number could not be verified." }, { status: 404 });
      }
      await setRegistration({
        ...state,
        verifiedName: response.data.name,
        verifiedPhone: phone.international,
        channel: provider,
      });
      return Response.json({
        name: response.data.name,
        phone: phone.international,
        accountExists: false,
      });
    }

    if (type === "ghana_card") {
      const id = textField(params.get("id"), "Ghana Card number", { max: 32 });
      const query = new URLSearchParams({ type, id });
      const response = await apiRequest<ApiEnvelope<VerifyResponse>>(`/verify?${query}`, {
        token: state.accessToken,
      });
      const card = response.data?.data ?? response.data;
      if (!card?.name) {
        return Response.json({ message: "The Ghana Card could not be verified." }, { status: 404 });
      }
      await setRegistration({
        ...state,
        verifiedGhanaCard: id,
        cardDateOfBirth: card.dateOfBirth,
      });
      return Response.json({ card });
    }

    return Response.json({ message: "Unsupported verification type." }, { status: 400 });
  } catch (error) {
    return errorResponse(error);
  }
}
