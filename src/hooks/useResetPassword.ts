"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import type { ResetPasswordResult } from "@/lib/api/types";

export function useResetPassword() {
  return useMutation({
    mutationFn: async (payload: { email: string }) =>
      (await axios.post<ResetPasswordResult>("/api/reset-password", payload)).data,
  });
}
