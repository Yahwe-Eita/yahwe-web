"use client";

import { Countdown } from "@/components/app/countdown";
import { EmptyState } from "@/components/app/empty-state";
import { InviteForm } from "@/components/app/invite-form";
import { PageHeading } from "@/components/app/page-heading";
import { QueryError, QueryLoading } from "@/components/app/query-state";
import { AnimatedProgress } from "@/components/motion/animated-progress";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { useHome } from "@/hooks/useHome";
import { useSessionUser } from "@/providers/session-provider";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function DashboardView() {
  const user = useSessionUser();
  const home = useHome();

  if (home.isPending) return <QueryLoading />;
  if (home.error) return <QueryError error={home.error} retry={() => home.refetch()} />;

  const data = home.data;
  const recruits = data.user?.recruits ?? [];
  const level = Math.max(0, Number(data.level ?? 0));

  return (
    <>
      <PageHeading
        eyebrow={greeting()}
        title={user.name}
        action={
          <InviteForm />
        }
      />

      <Stagger className="countdown-grid" ariaLabel="Registration cycle progress">
        <StaggerItem>
          <article className="countdown-card countdown-card-dark">
            <Countdown deadline={data.user?.recruitWindowEndsAt} activeLabel="Your 8-days time left" expiredLabel="Your 8 days to recruit have ended" />
            <div className="progress-row">
              <div className="progress-track"><AnimatedProgress value={level * 10} /></div>
              <small>Level {level}</small>
            </div>
          </article>
        </StaggerItem>
        <StaggerItem>
          <article className="countdown-card">
            <Countdown deadline={data.user?.cycleEndsAt} activeLabel="Your 8-weeks time left" expiredLabel="Your 8-week cycle has ended" />
            <div className="progress-row">
              <div className="progress-track"><AnimatedProgress value={level * 10} /></div>
              <small>Level {level}</small>
            </div>
          </article>
        </StaggerItem>
      </Stagger>

      <Stagger className="stats-grid" ariaLabel="Account summary">
        <StaggerItem><article className="stat-card stat-card-wide"><span>Self Reward Airtime:</span><strong>GH₵ {data.airtimeBalance}</strong></article></StaggerItem>
        <StaggerItem><article className="stat-card stat-card-accent"><span>Cash Earnings</span><strong>GH₵ {data.cashEarned}</strong></article></StaggerItem>
        <StaggerItem><article className="stat-card"><span>Downlines</span><strong>{data.totalRecruits ?? recruits.length} {(data.totalRecruits ?? recruits.length) > 1 ? "Downlines" : "Downline"}</strong></article></StaggerItem>
      </Stagger>

      <Reveal className="content-section" delay={0.1}>
        <div className="section-row"><h2>My Downlines</h2></div>
        {recruits.length ? (
          <Stagger className="people-grid">
            {recruits.map((recruit, index) => (
              <StaggerItem key={recruit.id ?? `${recruit.name}-${index}`}>
                <article className="person-card">
                  <span className="person-avatar">{recruit.name.charAt(0).toUpperCase()}</span>
                  <div><strong>{recruit.name.split(" ")[0]}</strong></div>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        ) : (
          <EmptyState title="No recruits yet" action={<InviteForm />} />
        )}
      </Reveal>
    </>
  );
}
