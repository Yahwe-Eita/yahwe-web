"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import type { ChangePasswordInput, ChangePasswordResult } from "@/lib/api/types";

export function useChangePassword() {
  return useMutation({
    mutationFn: async (payload: ChangePasswordInput) =>
      (await axios.post<ChangePasswordResult>("/api/password/change", payload)).data,
  });
}
