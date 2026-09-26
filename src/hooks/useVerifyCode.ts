"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import type { SuccessResult } from "@/lib/api/types";

export function useVerifyCode() {
  return useMutation({
    mutationFn: async (code: string) =>
      (await axios.post<SuccessResult>("/api/verify/code", { code })).data,
  });
}
