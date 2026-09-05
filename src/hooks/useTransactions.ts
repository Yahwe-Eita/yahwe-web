"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { TransactionsData } from "@/lib/api/types";
import { queryKeys } from "@/lib/query-keys";

export function useTransactions() {
  return useQuery({
    queryKey: queryKeys.transactions,
    queryFn: async () =>
      (await axios.get<TransactionsData>("/api/transactions/mobile")).data,
  });
}
