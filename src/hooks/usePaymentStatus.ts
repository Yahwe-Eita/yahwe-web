"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import type { PaymentStatusResult } from "@/lib/api/types";

export function usePaymentStatus(reference?: string) {
  return useMutation({
    mutationFn: async () =>
      (
        await axios.get<PaymentStatusResult>("/api/fee/status", {
          params: { reference },
        })
      ).data,
  });
}
