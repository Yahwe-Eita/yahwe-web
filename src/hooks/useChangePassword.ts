"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import type { ChangePasswordInput, SuccessResult } from "@/lib/api/types";

export function useChangePassword() {
  return useMutation({
    mutationFn: async (payload: ChangePasswordInput) =>
      (await axios.post<SuccessResult>("/api/password/change", payload)).data,
  });
}
