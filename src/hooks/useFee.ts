"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import type { FeeResult } from "@/lib/api/types";

export function useFee(again = false) {
  return useMutation({
    mutationFn: async () =>
      (await axios.post<FeeResult>(`/api/fee?again=${again}`)).data,
  });
}
