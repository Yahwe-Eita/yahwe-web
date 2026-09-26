"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { TransactionsPage } from "@/lib/api/types";
import { queryKeys } from "@/lib/query-keys";

export function useTransactions(page: number) {
  return useQuery({
    queryKey: queryKeys.transactionsPage(page),
    queryFn: async () =>
      (await axios.get<TransactionsPage>("/api/transactions/mobile", { params: { page } })).data,
    placeholderData: keepPreviousData,
  });
}
