"use client";

import { EmptyState } from "@/components/app/empty-state";
import { PageHeading } from "@/components/app/page-heading";
import { QueryError, QueryLoading } from "@/components/app/query-state";
import { Icon } from "@/components/icon";
import { useNotifications } from "@/hooks/useNotifications";
import { formatDateTime, formatRelativeTime } from "@/lib/format";

export function NotificationsView() {
  const notifications = useNotifications();
  const heading = <PageHeading title="Notifications" description="New members who joined your network." />;

  if (notifications.isPending) return <>{heading}<QueryLoading /></>;
  if (notifications.error) return <>{heading}<QueryError error={notifications.error} retry={() => notifications.refetch()} /></>;

  return (
    <>
      {heading}
      {notifications.data.length ? (
        <ul className="list-grid">
          {notifications.data.map((signup) => (
            <li className="member-row" key={signup.userId}>
              <span className="person-avatar" aria-hidden="true">
                <Icon name="mingcute:user-follow-line" size={18} />
              </span>
              <div>
                <strong>{signup.name} joined your network</strong>
                <small>
                  Level {signup.level}
                  {signup.level > 1 ? `, under ${signup.sponsorName}` : ""}
                </small>
              </div>
              <time dateTime={signup.joinedAt} title={formatDateTime(signup.joinedAt)}>
                {formatRelativeTime(signup.joinedAt)}
              </time>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState title="No new members yet" description="You will see people here as they join your network." />
      )}
    </>
  );
}
