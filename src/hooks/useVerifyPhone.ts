"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import type { PhoneVerificationResult } from "@/lib/api/types";

export function useVerifyPhone() {
  return useMutation({
    mutationFn: async (phone: string) =>
      (await axios.post<PhoneVerificationResult>("/api/verify/phone", { phone })).data,
  });
}
