"use client";

import Link from "next/link";
import { EmptyState } from "@/components/app/empty-state";
import { PageHeading } from "@/components/app/page-heading";
import { QueryError, QueryLoading } from "@/components/app/query-state";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { useGenealogy } from "@/hooks/useGenealogy";

export function GenealogyView({ depthLimit }: { depthLimit: number }) {
  const genealogy = useGenealogy();
  const heading = (
    <PageHeading
      title="Genealogy"
      action={
        <Link className="primary-action" href="/genealogy/tree">
          View tree
        </Link>
      }
    />
  );

  if (genealogy.isPending) return <>{heading}<QueryLoading /></>;
  if (genealogy.error) return <>{heading}<QueryError error={genealogy.error} retry={() => genealogy.refetch()} /></>;

  const recruits = genealogy.data.user.recruits;
  return (
    <>
      {heading}
      {recruits.length ? (
        <Stagger className="list-grid">
          {recruits.map((recruit) => (
            <StaggerItem key={recruit.id}>
              <article className="member-row">
                <span className="person-avatar" aria-hidden="true">
                  {recruit.name.charAt(0).toUpperCase()}
                </span>
                <strong>{recruit.name}</strong>
                <span className={`status-pill ${!recruit.active || recruit.recruitWindowClosed ? "status-inactive" : "status-active"}`}>
                  {!recruit.active ? "Inactive" : recruit.recruitWindowClosed ? "Window closed" : "Recruiting"}
                </span>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      ) : (
        <EmptyState title="No downlines yet" description="Invite someone to start building your network." />
      )}
      {genealogy.data.isTruncated ? (
        <p className="form-message form-message-info">
          Your network goes deeper than the {depthLimit} levels that earn rewards. Only those levels are shown.
        </p>
      ) : null}
    </>
  );
}
