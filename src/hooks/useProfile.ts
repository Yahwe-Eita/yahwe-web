"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { ProfileData } from "@/lib/api/types";
import { queryKeys } from "@/lib/query-keys";

export function useProfile() {
  return useQuery({
    queryKey: queryKeys.profile,
    queryFn: async () => (await axios.get<ProfileData>("/api/profile")).data,
  });
}
