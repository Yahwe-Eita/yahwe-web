"use client";

import Link from "next/link";
import { EmptyState } from "@/components/app/empty-state";
import { GenealogyTree } from "@/components/app/genealogy-tree";
import { PageHeading } from "@/components/app/page-heading";
import { QueryError, QueryLoading } from "@/components/app/query-state";
import { useGenealogy } from "@/hooks/useGenealogy";

export function GenealogyTreeView() {
  const genealogy = useGenealogy();
  if (genealogy.isPending) return <QueryLoading label="Loading Genealogy..." />;
  if (genealogy.error) return <QueryError error={genealogy.error} retry={() => genealogy.refetch()} title="Couldn't load genealogy" fallback="Please try again." retryLabel="Retry" />;

  return (
    <>
      <PageHeading
        title="Genealogy"
        action={
          <div className="button-row">
            <Link className="small-button" href="/genealogy" aria-label="Back">←</Link>
          </div>
        }
      />
      {genealogy.data.isTruncated ? (
        <p className="form-message form-message-info">
          Tree truncated at 15 levels. Deeper downlines exist but aren&apos;t shown.
        </p>
      ) : null}
      {genealogy.data.user ? (
        <GenealogyTree root={genealogy.data.user} />
      ) : (
        <EmptyState title="No Genealogy Data Yet" description="Start by recruiting or inviting your first member." />
      )}
    </>
  );
}
