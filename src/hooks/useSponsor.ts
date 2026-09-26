"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import type { SponsorResult } from "@/lib/api/types";

export function useSponsor() {
  return useMutation({
    mutationFn: async (phone: string) =>
      (await axios.post<SponsorResult>("/api/sponsor", { phone })).data,
  });
}
