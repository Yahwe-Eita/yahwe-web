"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { FeeOutcome } from "@/lib/api/types";

export function useFee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => (await axios.post<FeeOutcome>("/api/fee")).data,
    onSuccess: (result) => {
      if (result.outcome === "registered") queryClient.clear();
    },
  });
}
