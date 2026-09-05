"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { RegistrationInput, RegistrationResult } from "@/lib/api/types";

export function useRegister(validateOnly = false, again = false) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload?: RegistrationInput) =>
      (
        await axios.post<RegistrationResult>(
          `/api/auth/register?validate_only=${validateOnly}&again=${again}`,
          payload,
        )
      ).data,
    onSuccess: (result) => {
      if (result.status === "complete") queryClient.clear();
    },
  });
}
