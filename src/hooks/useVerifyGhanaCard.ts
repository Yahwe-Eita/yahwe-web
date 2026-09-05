"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import type { GhanaCardResult } from "@/lib/api/types";

export function useVerifyGhanaCard() {
  return useMutation({
    mutationFn: async (payload: { id: string }) =>
      (
        await axios.get<GhanaCardResult>("/api/verify", {
          params: { type: "ghana_card", id: payload.id },
        })
      ).data,
  });
}
