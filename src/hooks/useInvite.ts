"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { InvitePayload } from "@/lib/api/types";
import { queryKeys } from "@/lib/query-keys";

export function useInvite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: InvitePayload) =>
      (await axios.post<{ data: unknown }>("/api/invites", payload)).data,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.home }),
        queryClient.invalidateQueries({ queryKey: queryKeys.profile }),
        queryClient.invalidateQueries({ queryKey: queryKeys.genealogy }),
        queryClient.invalidateQueries({ queryKey: queryKeys.invitations }),
      ]);
    },
  });
}
