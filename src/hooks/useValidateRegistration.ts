"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import type { RegistrationInput, RegistrationResult } from "@/lib/api/types";

export function useValidateRegistration() {
  return useMutation({
    mutationFn: async (payload: RegistrationInput) =>
      (await axios.post<RegistrationResult>("/api/auth/register", payload)).data,
  });
}
