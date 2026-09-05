"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { SuccessResult } from "@/lib/api/types";

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () =>
      (await axios.post<SuccessResult>("/api/auth/logout")).data,
    onSettled: () => queryClient.clear(),
  });
}
