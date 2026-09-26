"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { SessionUser } from "@/lib/api/types";

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { email: string; password: string }) =>
      (await axios.post<{ user: SessionUser }>("/api/login/mobile", payload)).data,
    onSuccess: () => queryClient.clear(),
  });
}
