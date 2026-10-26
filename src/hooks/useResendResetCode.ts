"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import type { SuccessResult } from "@/lib/api/types";

export function useResendResetCode() {
  return useMutation({
    mutationFn: async (pinId: string) =>
      (await axios.post<SuccessResult>("/api/reset-password/resend", { pinId })).data,
  });
}
