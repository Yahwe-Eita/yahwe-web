"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { InvitedUser } from "@/lib/api/types";
import { queryKeys } from "@/lib/query-keys";

export function useInvitedUsers() {
  return useQuery({
    queryKey: queryKeys.invitations,
    queryFn: async () =>
      (await axios.get<InvitedUser[]>("/api/invites")).data,
  });
}
