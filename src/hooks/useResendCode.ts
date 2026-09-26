"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import type { SuccessResult } from "@/lib/api/types";

export function useResendCode() {
  return useMutation({
    mutationFn: async () => (await axios.post<SuccessResult>("/api/verify/resend")).data,
  });
}
