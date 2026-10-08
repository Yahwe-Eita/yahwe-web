"use client";

import { GenealogyTree } from "@/components/app/genealogy-tree";
import { Icon } from "@/components/icon";
import { PageHeading } from "@/components/app/page-heading";
import { QueryError, QueryLoading } from "@/components/app/query-state";
import { ButtonLink } from "@/components/ui/button-link";
import { Notice } from "@/components/ui/notice";
import { useGenealogy } from "@/hooks/useGenealogy";

export function GenealogyTreeView({ depthLimit }: { depthLimit: number }) {
  const genealogy = useGenealogy();
  const heading = (
    <PageHeading
      title="Genealogy"
      action={
        <ButtonLink variant="small" href="/genealogy">
          <Icon name="mingcute:arrow-left-line" size={18} /> List view
        </ButtonLink>
      }
    />
  );

  if (genealogy.isPending) return <>{heading}<QueryLoading label="Loading genealogy…" /></>;
  if (genealogy.error) return <>{heading}<QueryError title="Couldn't load genealogy" error={genealogy.error} retry={() => genealogy.refetch()} /></>;

  return (
    <>
      {heading}
      {genealogy.data.isTruncated ? (
        <Notice>
          Tree truncated at {depthLimit} levels. Deeper downlines exist but aren&apos;t shown.
        </Notice>
      ) : null}
      <GenealogyTree root={genealogy.data.user} />
    </>
  );
}
