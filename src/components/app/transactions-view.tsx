"use client";

import { useState } from "react";
import { EmptyState } from "@/components/app/empty-state";
import { PageHeading } from "@/components/app/page-heading";
import { QueryError, QueryLoading } from "@/components/app/query-state";
import { Button } from "@/components/ui/button";
import { StatusPill, type StatusTone } from "@/components/ui/status-pill";
import { useTransactions } from "@/hooks/useTransactions";
import type { TransactionStatus, TransactionType } from "@/lib/api/types";
import { formatCurrency, formatDateTime, formatRelativeTime } from "@/lib/format";

const typeLabels: Record<TransactionType, string> = {
  AIRTIME: "Airtime",
  CASH: "Cash",
  REVENUE: "Revenue",
};

const statusDisplay: Record<TransactionStatus, { label: string; tone: StatusTone }> = {
  PENDING: { label: "Pending", tone: "pending" },
  PROCESSING: { label: "Processing", tone: "processing" },
  COMPLETED: { label: "Completed", tone: "completed" },
  FAILED: { label: "Failed", tone: "failed" },
};

export function TransactionsView() {
  const [page, setPage] = useState(1);
  const query = useTransactions(page);
  const heading = <PageHeading title="Transaction history" />;

  if (query.isPending) return <>{heading}<QueryLoading /></>;
  if (query.error) return <>{heading}<QueryError error={query.error} retry={() => query.refetch()} /></>;

  const { transactions, total, pageSize } = query.data;
  const pages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <>
      {heading}
      {transactions.length ? (
        <>
          <ul className="transaction-list" aria-busy={query.isPlaceholderData || undefined}>
            {transactions.map((transaction) => (
              <li className="transaction-row" key={transaction.id}>
                <span className={`transaction-icon ${transaction.type === "AIRTIME" ? "airtime" : "cash"}`} aria-hidden="true">
                  {transaction.type === "AIRTIME" ? "A" : "₵"}
                </span>
                <div className="transaction-main">
                  <strong>{typeLabels[transaction.type]}</strong>
                  {transaction.description ? <span>{transaction.description}</span> : null}
                  <small>
                    <time dateTime={transaction.createdAt} title={formatDateTime(transaction.createdAt)}>
                      {formatRelativeTime(transaction.createdAt)}
                    </time>
                    {" · "}
                    {transaction.reference}
                  </small>
                </div>
                <div className="transaction-value">
                  <strong>{formatCurrency(transaction.amount)}</strong>
                  <StatusPill tone={statusDisplay[transaction.status].tone}>
                    {statusDisplay[transaction.status].label}
                  </StatusPill>
                </div>
              </li>
            ))}
          </ul>
          {pages > 1 ? (
            <nav className="pagination" aria-label="Transaction pages">
              <Button variant="small" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                Newer
              </Button>
              <span>
                Page {page} of {pages}
              </span>
              <Button variant="small" disabled={page >= pages} onClick={() => setPage(page + 1)}>
                Older
              </Button>
            </nav>
          ) : null}
        </>
      ) : (
        <EmptyState title="No transaction yet" description="You haven't invited anyone yet." />
      )}
    </>
  );
}
