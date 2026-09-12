"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import type { PaymentStatusResult } from "@/lib/api/types";
import { useStore } from "@/store/useStore";

export function usePaymentStatus(reference?: string) {
const accessToken = useStore(state => state.accessToken);
  return useMutation({
    mutationFn: async () =>
      (
        await axios.get<PaymentStatusResult>("/api/fee/status", {
          params: { reference },
          ...(accessToken && { headers: { Authorization: `Bearer ${accessToken}` } }),
        })
      ).data,
  });
}
