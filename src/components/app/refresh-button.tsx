"use client";

import { useIsFetching, useQueryClient, type QueryKey } from "@tanstack/react-query";

export function RefreshButton({ queryKey }: { queryKey: QueryKey }) {
  const queryClient = useQueryClient();
  const pending = useIsFetching({ queryKey }) > 0;
  return (
    <button
      className="small-button"
      type="button"
      disabled={pending}
      onClick={() => queryClient.invalidateQueries({ queryKey })}
    >
      {pending ? "Refreshing…" : "Refresh"}
    </button>
  );
}
