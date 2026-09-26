import type { ApiEnvelope, Transaction, TransactionsPage } from "@/lib/api/types";
import { sessionRequest } from "@/lib/server/api-session";
import { errorResponse, json } from "@/lib/server/request";

const PAGE_SIZE = 20;

export async function GET(request: Request) {
  try {
    const requested = Number(new URL(request.url).searchParams.get("page") ?? 1);
    const page = Number.isInteger(requested) && requested > 0 ? requested : 1;
    const query = new URLSearchParams({ page: String(page), page_size: String(PAGE_SIZE) });
    const response = await sessionRequest<ApiEnvelope<Transaction[]>>(`/transactions/mobile?${query}`);
    return json<TransactionsPage>({
      transactions: response.data ?? [],
      total: response.total ?? 0,
      page,
      pageSize: PAGE_SIZE,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
