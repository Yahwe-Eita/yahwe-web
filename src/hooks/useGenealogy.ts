"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { GenealogyData } from "@/lib/api/types";
import { queryKeys } from "@/lib/query-keys";

export function useGenealogy() {
  return useQuery({
    queryKey: queryKeys.genealogy,
    queryFn: async () =>
      (await axios.get<GenealogyData>("/api/geneology")).data,
  });
}
