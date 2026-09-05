"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { SuccessResult } from "@/lib/api/types";

export function useDeleteAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () =>
      (await axios.delete<SuccessResult>("/api/profile")).data,
    onSuccess: () => queryClient.clear(),
  });
}
