import type { ApiEnvelope, Transaction, TransactionsData } from "@/lib/api/types";
import { apiRequest } from "@/lib/api/upstream";
import { requireApiSession } from "@/lib/server/api-session";
import { errorResponse } from "@/lib/server/request";

export async function GET() {
  try {
    const session = await requireApiSession();
    const response = await apiRequest<ApiEnvelope<Transaction[]>>(
      "/transactions/mobile",
      { token: session.accessToken },
    );
    const data: TransactionsData = {
      transactions: response.data ?? [],
      total: response.total ?? response.data?.length ?? 0,
    };
    return Response.json(data);
  } catch (error) {
    return errorResponse(error);
  }
}
