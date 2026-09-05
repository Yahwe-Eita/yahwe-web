"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { HomeData } from "@/lib/api/types";
import { queryKeys } from "@/lib/query-keys";

export function useHome() {
  return useQuery({
    queryKey: queryKeys.home,
    queryFn: async () => (await axios.get<HomeData>("/api/home")).data,
  });
}
