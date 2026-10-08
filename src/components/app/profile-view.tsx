"use client";

import { DeleteAccount } from "@/components/app/delete-account";
import { LogoutButton } from "@/components/app/logout-button";
import { PageHeading } from "@/components/app/page-heading";
import { QueryError, QueryLoading } from "@/components/app/query-state";
import { Avatar } from "@/components/ui/avatar";
import { ButtonGroup } from "@/components/ui/button-group";
import { ContentSection } from "@/components/ui/content-section";
import { Grid } from "@/components/ui/grid";
import { PersonCard } from "@/components/ui/person-card";
import { StatCard } from "@/components/ui/stat-card";
import { StatusPill } from "@/components/ui/status-pill";
import { useProfile } from "@/hooks/useProfile";
import { formatCurrency } from "@/lib/format";
import { useSessionUser } from "@/providers/session-provider";

export function ProfileView() {
  const user = useSessionUser();
  const profileQuery = useProfile();
  const heading = <PageHeading title="Profile" />;

  if (profileQuery.isPending) return <>{heading}<QueryLoading /></>;
  if (profileQuery.error) return <>{heading}<QueryError error={profileQuery.error} retry={() => profileQuery.refetch()} /></>;

  const profile = profileQuery.data;
  const recruits = profile.userInfo.recruits;
  return (
    <>
      {heading}
      <section className="profile-card">
        <Avatar name={user.name} size="profile" />
        <div>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <p>Level {profile.level}</p>
        </div>
      </section>
      <Grid variant="stats" as="section" ariaLabel="Profile summary">
        <StatCard label="Number of downlines" value={profile.totalRecruits} />
        <StatCard label="Self reward airtime" value={formatCurrency(profile.balance)} />
        <StatCard label="Cash earnings" value={formatCurrency(profile.cashEarned)} />
      </Grid>
      {recruits.length ? (
        <ContentSection title="My downlines">
          <Grid variant="people">
            {recruits.map((recruit) => (
              <PersonCard
                key={recruit.userId}
                name={recruit.name}
                badge={recruit.blocked ? <StatusPill tone="inactive">Blocked</StatusPill> : null}
              />
            ))}
          </Grid>
        </ContentSection>
      ) : null}
      <ButtonGroup variant="profile">
        <LogoutButton />
      </ButtonGroup>
      <DeleteAccount />
    </>
  );
}
