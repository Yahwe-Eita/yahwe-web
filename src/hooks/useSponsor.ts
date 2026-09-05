"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import type { SponsorResult } from "@/lib/api/types";

export function useSponsor() {
  return useMutation({
    mutationFn: async (phone: string) =>
      (
        await axios.get<SponsorResult>("/api/sponsor", {
          params: { phone },
        })
      ).data,
  });
}
