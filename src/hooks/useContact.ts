"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";

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
      (await axios.post<{ sent: true }>("/api/contact", input)).data,
  });
}
