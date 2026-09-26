"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { RegistrationResult } from "@/lib/api/types";

export function useCompleteRegistration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () =>
      (await axios.post<RegistrationResult>("/api/auth/register/complete")).data,
    onSuccess: () => queryClient.clear(),
  });
}
