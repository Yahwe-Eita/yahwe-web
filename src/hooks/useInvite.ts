"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import type { InvitePayload, SuccessResult } from "@/lib/api/types";

export function useInvite() {
  return useMutation({
    mutationFn: async (payload: InvitePayload) =>
      (await axios.post<SuccessResult>("/api/invites", payload)).data,
  });
}
