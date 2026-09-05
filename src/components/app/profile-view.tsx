"use client";

import { DeleteAccount } from "@/components/app/delete-account";
import { PageHeading } from "@/components/app/page-heading";
import { QueryError, QueryLoading } from "@/components/app/query-state";
import { useProfile } from "@/hooks/useProfile";
import { useSessionUser } from "@/providers/session-provider";

export function ProfileView() {
  const user = useSessionUser();
  const profileQuery = useProfile();
  if (profileQuery.isPending) return <QueryLoading />;
  if (profileQuery.error) return <QueryError error={profileQuery.error} retry={() => profileQuery.refetch()} />;

  const profile = profileQuery.data;
  const recruits = profile.userInfo?.recruits ?? [];
  return (
    <>
      <PageHeading
        title="Profile"
      />
      <section className="profile-card">
        <span className="profile-avatar">{user.name.charAt(0).toUpperCase()}</span>
        <div><h2>{user.name}</h2><p>{user.email}</p></div>
      </section>
      <section className="stats-grid profile-stats" aria-label="Profile summary">
        <article className="stat-card"><span>Number of downlines: {profile.totalRecruits ?? recruits.length}</span></article>
        <article className="stat-card"><span>Self Reward Airtime</span><strong>{profile.balance} GHS</strong></article>
      </section>
      {recruits.length ? (
        <section className="content-section">
          <div className="section-row"><h2>My Downlines</h2></div>
          <div className="people-grid">
            {recruits.map((recruit, index) => (
              <article className="person-card" key={recruit.id ?? `${recruit.name}-${index}`}>
                <span className="person-avatar">{recruit.name.charAt(0).toUpperCase()}</span>
                <div><strong>{recruit.name}</strong></div>
              </article>
            ))}
          </div>
        </section>
      ) : null}
      <DeleteAccount />
    </>
  );
}
