"use client";

import Link from "next/link";
import { EmptyState } from "@/components/app/empty-state";
import { PageHeading } from "@/components/app/page-heading";
import { QueryError, QueryLoading } from "@/components/app/query-state";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { useGenealogy } from "@/hooks/useGenealogy";

export function GenealogyView() {
  const genealogy = useGenealogy();
  if (genealogy.isPending) return <QueryLoading />;
  if (genealogy.error) return <QueryError error={genealogy.error} retry={() => genealogy.refetch()} title="Couldn't load genealogy" fallback="Please try again." retryLabel="Retry" />;

  const recruits = genealogy.data?.user.recruits ?? [];
  return (
    <>
      <PageHeading
        title="Genealogy"
        action={
          <div className="button-row">
            <Link className="primary-action" href="/genealogy/tree">VIEW TREE</Link>
          </div>
        }
      />
      {recruits.length ? (
        <Stagger className="list-grid">
          {recruits.map((recruit, index) => {
            const windowClosed = recruit.recruitWindowClosed === true || recruit.recruitWindowClosed === "true";
            const inactive = recruit.active === false;
            return (
              <StaggerItem key={recruit.id ?? `${recruit.name}-${index}`}>
                <article className="member-row">
                  <span className="person-avatar">{recruit.name.charAt(0).toUpperCase()}</span>
                  <div><small>Downline</small><strong>{recruit.name}</strong></div>
                  <span className={`status-pill ${inactive || windowClosed ? "status-inactive" : "status-active"}`}>
                    {inactive ? "Suspended" : windowClosed ? "Window closed" : "Recruiting"}
                  </span>
                </article>
              </StaggerItem>
            );
          })}
        </Stagger>
      ) : (
        <EmptyState title="No genealogy data yet." description="You haven't invited anyone yet." />
      )}
      {genealogy.data.isTruncated ? (
        <p className="form-message form-message-info">
          Your tree runs deeper than the 8 levels shown here. Levels beyond the eighth do not earn rewards.
        </p>
      ) : null}
    </>
  );
}
