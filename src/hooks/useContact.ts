"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import type { SuccessResult } from "@/lib/api/types";

export interface ContactInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

export function useContact() {
  return useMutation({
    mutationFn: async (input: ContactInput) =>
      (await axios.post<SuccessResult>("/api/contact", input)).data,
  });
}
