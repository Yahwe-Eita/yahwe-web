"use client";

import { DeleteAccount } from "@/components/app/delete-account";
import { LogoutButton } from "@/components/app/logout-button";
import { PageHeading } from "@/components/app/page-heading";
import { QueryError, QueryLoading } from "@/components/app/query-state";
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
        <span className="profile-avatar" aria-hidden="true">
          {user.name.charAt(0).toUpperCase()}
        </span>
        <div>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>
      </section>
      <section className="stats-grid" aria-label="Profile summary">
        <article className="stat-card">
          <span>Downline members</span>
          <strong>{profile.totalRecruits}</strong>
        </article>
        <article className="stat-card">
          <span>Airtime rewards</span>
          <strong>{formatCurrency(profile.balance)}</strong>
        </article>
        <article className="stat-card">
          <span>Cash rewards this cycle</span>
          <strong>{formatCurrency(profile.cashEarned)}</strong>
        </article>
      </section>
      {recruits.length ? (
        <section className="content-section">
          <div className="section-row">
            <h2>Your direct downlines</h2>
          </div>
          <div className="people-grid">
            {recruits.map((recruit) => (
              <article className="person-card" key={recruit.userId}>
                <span className="person-avatar" aria-hidden="true">
                  {recruit.name.charAt(0).toUpperCase()}
                </span>
                <strong>{recruit.name}</strong>
                {recruit.blocked ? <span className="status-pill status-inactive">Blocked</span> : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}
      <div className="profile-actions">
        <LogoutButton />
      </div>
      <DeleteAccount />
    </>
  );
}
