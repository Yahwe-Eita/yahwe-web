import type { Metadata } from "next";
import { PageHeading } from "@/components/app/page-heading";

export const metadata: Metadata = { title: "Notifications" };

export default function NotificationsPage() {
  return (
    <>
      <PageHeading title="Notifications" />
      <div className="list-grid">
        <div className="member-row"><strong>Karen</strong> joined with your referral code</div>
        <div className="member-row"><strong>Kwesi</strong> joined with your referral code</div>
      </div>
    </>
  );
}
