"use client";

import Link from "next/link";
import { GenealogyTree } from "@/components/app/genealogy-tree";
import { Icon } from "@/components/icon";
import { PageHeading } from "@/components/app/page-heading";
import { QueryError, QueryLoading } from "@/components/app/query-state";
import { useGenealogy } from "@/hooks/useGenealogy";

export function GenealogyTreeView({ depthLimit }: { depthLimit: number }) {
  const genealogy = useGenealogy();
  const heading = (
    <PageHeading
      title="Genealogy tree"
      action={
        <Link className="small-button" href="/genealogy">
          <Icon name="mingcute:arrow-left-line" size={18} /> List view
        </Link>
      }
    />
  );

  if (genealogy.isPending) return <>{heading}<QueryLoading /></>;
  if (genealogy.error) return <>{heading}<QueryError error={genealogy.error} retry={() => genealogy.refetch()} /></>;

  return (
    <>
      {heading}
      {genealogy.data.isTruncated ? (
        <p className="form-message form-message-info">
          Your network goes deeper than the {depthLimit} levels that earn rewards. Only those levels are shown.
        </p>
      ) : null}
      <GenealogyTree root={genealogy.data.user} />
    </>
  );
}
