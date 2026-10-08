"use client";

import { Countdown } from "@/components/app/countdown";
import { EmptyState } from "@/components/app/empty-state";
import { InviteForm } from "@/components/app/invite-form";
import { PageHeading } from "@/components/app/page-heading";
import { QueryError, QueryLoading } from "@/components/app/query-state";
import { AnimatedProgress } from "@/components/motion/animated-progress";
import { StaggerItem } from "@/components/motion/reveal";
import { ContentSection } from "@/components/ui/content-section";
import { CountdownCard } from "@/components/ui/countdown-card";
import { Grid } from "@/components/ui/grid";
import { PersonCard } from "@/components/ui/person-card";
import { StatCard } from "@/components/ui/stat-card";
import { useHome } from "@/hooks/useHome";
import { formatCurrency } from "@/lib/format";
import { useSessionUser } from "@/providers/session-provider";

function greeting(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function cyclePeriod(cycleDays: number) {
  return cycleDays % 7 === 0 ? { count: cycleDays / 7, unit: "week" } : { count: cycleDays, unit: "day" };
}

export function DashboardView({
  depthLimit,
  recruitWindowDays,
  cycleDays,
}: {
  depthLimit: number;
  recruitWindowDays: number;
  cycleDays: number;
}) {
  const user = useSessionUser();
  const home = useHome();
  const heading = <PageHeading greeting={greeting(new Date().getHours())} title={user.name} action={<InviteForm />} />;

  if (home.isPending) return <>{heading}<QueryLoading /></>;
  if (home.error) return <>{heading}<QueryError error={home.error} retry={() => home.refetch()} /></>;

  const data = home.data;
  const recruits = data.user.recruits;
  const levelProgress = (Math.min(data.level, depthLimit) / depthLimit) * 100;
  const levelLabel = `Level ${data.level} of ${depthLimit}`;
  const cycle = cyclePeriod(cycleDays);

  return (
    <>
      {heading}
      <Grid variant="countdown" stagger ariaLabel="Your deadlines">
        <StaggerItem>
          <CountdownCard dark>
            <Countdown
              deadline={data.user.recruitWindowEndsAt}
              activeLabel={`Your ${recruitWindowDays}-days time left`}
              expiredLabel={`Your ${recruitWindowDays} days to recruit have ended`}
            />
            <div className="progress-row">
              <div className="progress-track" role="progressbar" aria-label={levelLabel} aria-valuenow={data.level} aria-valuemin={0} aria-valuemax={depthLimit}>
                <AnimatedProgress value={levelProgress} />
              </div>
              <small>Level {data.level}</small>
            </div>
          </CountdownCard>
        </StaggerItem>
        <StaggerItem>
          <CountdownCard>
            <Countdown
              deadline={data.user.cycleEndsAt}
              activeLabel={`Your ${cycle.count}-${cycle.unit}s time left`}
              expiredLabel={`Your ${cycle.count}-${cycle.unit} cycle has ended`}
            />
          </CountdownCard>
        </StaggerItem>
      </Grid>

      <Grid variant="stats" stagger ariaLabel="Account summary">
        <StaggerItem>
          <StatCard label="Self reward airtime" value={formatCurrency(data.airtimeBalance)} />
        </StaggerItem>
        <StaggerItem>
          <StatCard label="Cash earnings" value={formatCurrency(data.cashEarned)} accent />
        </StaggerItem>
        <StaggerItem>
          <StatCard label="Downlines" value={data.totalRecruits} />
        </StaggerItem>
      </Grid>

      <ContentSection title="My downlines">
        {recruits.length ? (
          <Grid variant="people" stagger>
            {recruits.map((recruit) => (
              <StaggerItem key={recruit.id}>
                <PersonCard name={recruit.name} />
              </StaggerItem>
            ))}
          </Grid>
        ) : (
          <EmptyState title="No recruits yet" description="Invite someone to start building your network." />
        )}
      </ContentSection>
    </>
  );
}
