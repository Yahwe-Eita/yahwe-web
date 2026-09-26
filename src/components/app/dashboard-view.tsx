"use client";

import { Countdown } from "@/components/app/countdown";
import { EmptyState } from "@/components/app/empty-state";
import { InviteForm } from "@/components/app/invite-form";
import { PageHeading } from "@/components/app/page-heading";
import { QueryError, QueryLoading } from "@/components/app/query-state";
import { AnimatedProgress } from "@/components/motion/animated-progress";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { useHome } from "@/hooks/useHome";
import { formatCurrency } from "@/lib/format";
import { useSessionUser } from "@/providers/session-provider";

function greeting(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function DashboardView({ depthLimit }: { depthLimit: number }) {
  const user = useSessionUser();
  const home = useHome();
  const heading = <PageHeading greeting={greeting(new Date().getHours())} title={user.name} action={<InviteForm />} />;

  if (home.isPending) return <>{heading}<QueryLoading /></>;
  if (home.error) return <>{heading}<QueryError error={home.error} retry={() => home.refetch()} /></>;

  const data = home.data;
  const recruits = data.user.recruits;
  const levelProgress = (Math.min(data.level, depthLimit) / depthLimit) * 100;
  const levelLabel = `Level ${data.level} of ${depthLimit}`;

  return (
    <>
      {heading}
      <Stagger className="countdown-grid" ariaLabel="Your deadlines">
        <StaggerItem>
          <article className="countdown-card countdown-card-dark">
            <Countdown
              deadline={data.user.recruitWindowEndsAt}
              activeLabel="Time left to recruit"
              expiredLabel="Your recruiting window has ended"
            />
            <div className="progress-row">
              <div className="progress-track" role="progressbar" aria-label={levelLabel} aria-valuenow={data.level} aria-valuemin={0} aria-valuemax={depthLimit}>
                <AnimatedProgress value={levelProgress} />
              </div>
              <small>{levelLabel}</small>
            </div>
          </article>
        </StaggerItem>
        <StaggerItem>
          <article className="countdown-card">
            <Countdown deadline={data.user.cycleEndsAt} activeLabel="Time left in your cycle" expiredLabel="Your cycle has ended" />
          </article>
        </StaggerItem>
      </Stagger>

      <Stagger className="stats-grid" ariaLabel="Account summary">
        <StaggerItem>
          <article className="stat-card">
            <span>Airtime rewards</span>
            <strong>{formatCurrency(data.airtimeBalance)}</strong>
          </article>
        </StaggerItem>
        <StaggerItem>
          <article className="stat-card stat-card-accent">
            <span>Cash rewards this cycle</span>
            <strong>{formatCurrency(data.cashEarned)}</strong>
          </article>
        </StaggerItem>
        <StaggerItem>
          <article className="stat-card">
            <span>Downline members</span>
            <strong>{data.totalRecruits}</strong>
          </article>
        </StaggerItem>
      </Stagger>

      <section className="content-section">
        <div className="section-row">
          <h2>Your direct downlines</h2>
        </div>
        {recruits.length ? (
          <Stagger className="people-grid">
            {recruits.map((recruit) => (
              <StaggerItem key={recruit.id}>
                <article className="person-card">
                  <span className="person-avatar" aria-hidden="true">
                    {recruit.name.charAt(0).toUpperCase()}
                  </span>
                  <strong>{recruit.name}</strong>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        ) : (
          <EmptyState title="No downlines yet" description="Invite someone to start building your network." />
        )}
      </section>
    </>
  );
}
