import type { Metadata } from "next";
import { EmptyState } from "@/components/app/empty-state";
import { PageHeading } from "@/components/app/page-heading";

export const metadata: Metadata = { title: "Notifications" };

export default function NotificationsPage() {
  return (
    <>
      <PageHeading eyebrow="Updates" title="Notifications" description="Important account and network updates will appear here." />
      <EmptyState title="You’re all caught up" description="There are no new notifications. We won’t show the mobile app’s placeholder notifications as real activity." />
    </>
  );
}
