import type { Metadata } from "next";
import { Countdown } from "@/components/app/countdown";
import { EmptyState } from "@/components/app/empty-state";
import { InviteForm } from "@/components/app/invite-form";
import { PageHeading } from "@/components/app/page-heading";
import { RefreshButton } from "@/components/app/refresh-button";
import { AnimatedProgress } from "@/components/motion/animated-progress";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { formatCurrency } from "@/lib/format";
import { getHomeData, requireSession } from "@/lib/server/data";

export const metadata: Metadata = { title: "Dashboard" };

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default async function DashboardPage() {
  const [session, data] = await Promise.all([requireSession(), getHomeData()]);
  const recruits = data.userInfo?.recruits ?? [];
  const level = Math.max(0, Number(data.level ?? 0));

  return (
    <>
      <PageHeading
        eyebrow={greeting()}
        title={`Welcome, ${session.user.name.split(" ")[0]}`}
        description="Here is the latest activity across your Yahwe-Eita network."
        action={
          <div className="button-row">
            <RefreshButton />
            <InviteForm />
          </div>
        }
      />

      <Stagger className="countdown-grid" ariaLabel="Registration cycle progress">
        <StaggerItem>
        <article className="countdown-card countdown-card-dark">
          <span>Recruitment window</span>
          <strong><Countdown createdAt={data.userInfo?.createdAt} days={8} /></strong>
          <div className="progress-row">
            <div className="progress-track"><AnimatedProgress value={level * 10} /></div>
            <small>Level {level}</small>
          </div>
        </article>
        </StaggerItem>
        <StaggerItem>
        <article className="countdown-card">
          <span>Eight-week cycle</span>
          <strong><Countdown createdAt={data.userInfo?.createdAt} days={56} /></strong>
          <div className="progress-row">
            <div className="progress-track"><AnimatedProgress value={level * 10} /></div>
            <small>Level {level}</small>
          </div>
        </article>
        </StaggerItem>
      </Stagger>

      <Stagger className="stats-grid" ariaLabel="Account summary">
        <StaggerItem>
        <article className="stat-card stat-card-wide">
          <span>Self-reward airtime</span>
          <strong>{formatCurrency(data.balance)}</strong>
        </article>
        </StaggerItem>
        <StaggerItem>
        <article className="stat-card stat-card-accent">
          <span>Cash earnings</span>
          <strong>{formatCurrency(data.earnedThisWeek)}</strong>
        </article>
        </StaggerItem>
        <StaggerItem>
        <article className="stat-card">
          <span>Downlines</span>
          <strong>{data.totalRecruits ?? recruits.length}</strong>
        </article>
        </StaggerItem>
      </Stagger>

      <Reveal className="content-section" delay={0.1}>
        <div className="section-row">
          <div>
            <p className="eyebrow">Your network</p>
            <h2>My downlines</h2>
          </div>
        </div>
        {recruits.length ? (
          <Stagger className="people-grid">
            {recruits.map((recruit, index) => (
              <StaggerItem key={recruit.id ?? `${recruit.name}-${index}`}>
              <article className="person-card">
                <span className="person-avatar">{recruit.name.charAt(0).toUpperCase()}</span>
                <div>
                  <strong>{recruit.name}</strong>
                  <small>{recruit.verified ? "Verified" : "Invited"}</small>
                </div>
              </article>
              </StaggerItem>
            ))}
          </Stagger>
        ) : (
          <EmptyState
            title="No downlines yet"
            description="Invite someone to start building your network."
            action={<InviteForm />}
          />
        )}
      </Reveal>
    </>
  );
}
