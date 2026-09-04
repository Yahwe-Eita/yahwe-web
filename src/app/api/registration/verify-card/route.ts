import type { ApiEnvelope } from "@/lib/api/types";
import { apiRequest } from "@/lib/api/upstream";
import {
  getRegistration,
  setRegistration,
} from "@/lib/server/registration";
import { assertSameOrigin, errorResponse } from "@/lib/server/request";
import { isRecord, textField } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const state = await getRegistration();
    if (!state) {
      return Response.json({ message: "Registration session expired." }, { status: 409 });
    }

    const input: unknown = await request.json();
    if (!isRecord(input)) throw new Error("Invalid verification request.");
    const id = textField(input.id, "Ghana Card number", { max: 32 });
    const query = new URLSearchParams({ type: "ghana_card", id });
    const response = await apiRequest<
      ApiEnvelope<{
        data?: { name?: string; dateOfBirth?: string };
        name?: string;
        dateOfBirth?: string;
      }>
    >(`/verify?${query}`, { token: state.accessToken });
    const card = response.data?.data ?? response.data;
    if (!card?.name) {
      return Response.json(
        { message: "The Ghana Card could not be verified." },
        { status: 404 },
      );
    }

    await setRegistration({
      ...state,
      verifiedGhanaCard: id,
      cardDateOfBirth: card.dateOfBirth,
    });

    return Response.json({ card });
  } catch (error) {
    return errorResponse(error);
  }
}
