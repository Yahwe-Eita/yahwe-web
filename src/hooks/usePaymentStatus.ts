"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { PaymentStatusResult } from "@/lib/api/types";
import { queryKeys } from "@/lib/query-keys";

export const MAX_STATUS_CHECKS = 24;

/** Seconds before the next automatic check: 5 s growing by 30% per check, capped at 20 s. */
export function statusCheckDelay(checks: number) {
  return Math.round(Math.min(5 * 1.3 ** checks, 20));
}

function isSettled(status: PaymentStatusResult["status"] | undefined) {
  return status === "COMPLETED" || status === "FAILED";
}

export function usePaymentStatus() {
  return useQuery({
    queryKey: queryKeys.paymentStatus,
    queryFn: async () => (await axios.get<PaymentStatusResult>("/api/fee/status")).data,
    refetchInterval: (query) => {
      const checks = query.state.dataUpdateCount + query.state.errorUpdateCount;
      if (isSettled(query.state.data?.status) || checks >= MAX_STATUS_CHECKS) return false;
      return statusCheckDelay(checks) * 1000;
    },
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 0,
  });
}
