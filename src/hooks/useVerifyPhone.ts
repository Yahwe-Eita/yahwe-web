"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import type { PhoneVerificationResult } from "@/lib/api/types";

export function useVerifyPhone() {
  return useMutation({
    mutationFn: async (payload: { phone: string }) =>
      (
        await axios.get<PhoneVerificationResult>("/api/verify", {
          params: { type: "phone", id: payload.phone, provider: "mtn-gh" },
        })
      ).data,
  });
}
