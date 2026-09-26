import "server-only";

import { unstable_cache } from "next/cache";
import type { ApiEnvelope, Programme } from "@/lib/api/types";
import { apiRequest } from "@/lib/api/upstream";
import { HttpError } from "@/lib/http-error";

/** The programme figures are owned by the API; this only caches them for five minutes. */
export const getProgramme = unstable_cache(
  async (): Promise<Programme> => {
    const response = await apiRequest<ApiEnvelope<Programme>>("/programme");
    if (!response.data) {
      throw new HttpError("The service is temporarily unavailable. Please try again.", 502);
    }
    return response.data;
  },
  ["programme"],
  { revalidate: 300 },
);
