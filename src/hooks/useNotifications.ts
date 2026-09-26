"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { DownlineSignup } from "@/lib/api/types";
import { queryKeys } from "@/lib/query-keys";

export function useNotifications() {
  return useQuery({
    queryKey: queryKeys.notifications,
    queryFn: async () => (await axios.get<DownlineSignup[]>("/api/notifications")).data,
  });
}
