import type { Metadata } from "next";
import Link from "next/link";
import { DeleteAccount } from "@/components/app/delete-account";
import { PageHeading } from "@/components/app/page-heading";
import { formatCurrency } from "@/lib/format";
import { getProfileData, requireSession } from "@/lib/server/data";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage() {
  const [session, profile] = await Promise.all([requireSession(), getProfileData()]);
  const recruits = profile.userInfo?.recruits ?? [];
  return (
    <>
      <PageHeading
        eyebrow="Your account"
        title="Profile"
        description="Review your account and network details."
        action={<Link className="small-button" href="/settings">Settings</Link>}
      />
      <section className="profile-card">
        <span className="profile-avatar">{session.user.name.charAt(0).toUpperCase()}</span>
        <div>
          <h2>{session.user.name}</h2>
          <p>{session.user.email}</p>
        </div>
        <div className="profile-level">
          <span>Current level</span>
          <strong>{profile.level ?? 0}</strong>
        </div>
      </section>
      <section className="stats-grid profile-stats" aria-label="Profile summary">
        <article className="stat-card"><span>Downlines</span><strong>{profile.totalRecruits ?? recruits.length}</strong></article>
        <article className="stat-card"><span>Self-reward airtime</span><strong>{formatCurrency(profile.balance)}</strong></article>
        <article className="stat-card stat-card-accent"><span>Cash earnings</span><strong>{formatCurrency(profile.earnedThisWeek)}</strong></article>
      </section>
      {recruits.length ? (
        <section className="content-section">
          <div className="section-row"><h2>My downlines</h2></div>
          <div className="people-grid">
            {recruits.map((recruit, index) => (
              <article className="person-card" key={recruit.id ?? `${recruit.name}-${index}`}>
                <span className="person-avatar">{recruit.name.charAt(0).toUpperCase()}</span>
                <div><strong>{recruit.name}</strong><small>{recruit.verified ? "Verified" : "Invited"}</small></div>
              </article>
            ))}
          </div>
        </section>
      ) : null}
      <DeleteAccount />
    </>
  );
}
