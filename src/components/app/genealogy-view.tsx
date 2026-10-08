"use client";

import { EmptyState } from "@/components/app/empty-state";
import { PageHeading } from "@/components/app/page-heading";
import { QueryError, QueryLoading } from "@/components/app/query-state";
import { StaggerItem } from "@/components/motion/reveal";
import { Avatar } from "@/components/ui/avatar";
import { ButtonLink } from "@/components/ui/button-link";
import { Grid } from "@/components/ui/grid";
import { MemberRow } from "@/components/ui/member-row";
import { Notice } from "@/components/ui/notice";
import { StatusPill } from "@/components/ui/status-pill";
import { useGenealogy } from "@/hooks/useGenealogy";

export function GenealogyView({ depthLimit }: { depthLimit: number }) {
  const genealogy = useGenealogy();
  const heading = (
    <PageHeading
      title="Genealogy"
      action={
        <ButtonLink variant="action" href="/genealogy/tree">
          View tree
        </ButtonLink>
      }
    />
  );

  if (genealogy.isPending) return <>{heading}<QueryLoading /></>;
  if (genealogy.error) return <>{heading}<QueryError title="Couldn't load genealogy" error={genealogy.error} retry={() => genealogy.refetch()} /></>;

  const recruits = genealogy.data.user.recruits;
  return (
    <>
      {heading}
      {recruits.length ? (
        <Grid variant="list" stagger>
          {recruits.map((recruit) => (
            <StaggerItem key={recruit.id}>
              <MemberRow
                avatar={<Avatar name={recruit.name} />}
                trailing={
                  <StatusPill tone={!recruit.active || recruit.recruitWindowClosed ? "inactive" : "active"}>
                    {!recruit.active ? "Suspended" : recruit.recruitWindowClosed ? "Window closed" : "Recruiting"}
                  </StatusPill>
                }
              >
                <small>Downline</small>
                <strong>{recruit.name}</strong>
              </MemberRow>
            </StaggerItem>
          ))}
        </Grid>
      ) : (
        <EmptyState title="No genealogy data yet" description="You haven't invited anyone yet." />
      )}
      {genealogy.data.isTruncated ? (
        <Notice>
          Your tree runs deeper than the {depthLimit} levels shown here. Levels beyond level {depthLimit} do not earn rewards.
        </Notice>
      ) : null}
    </>
  );
}
