"use client";

import { useState } from "react";
import { EmptyState } from "@/components/app/empty-state";
import { PageHeading } from "@/components/app/page-heading";
import { QueryError, QueryLoading } from "@/components/app/query-state";
import { useTransactions } from "@/hooks/useTransactions";
import type { TransactionStatus, TransactionType } from "@/lib/api/types";
import { formatCurrency, formatDateTime } from "@/lib/format";

const typeLabels: Record<TransactionType, string> = {
  AIRTIME: "Airtime reward",
  CASH: "Cash reward",
  REVENUE: "Payment",
};

const statusLabels: Record<TransactionStatus, string> = {
  PENDING: "Pending",
  PROCESSING: "Processing",
  COMPLETED: "Completed",
  FAILED: "Failed",
};

export function TransactionsView() {
  const [page, setPage] = useState(1);
  const query = useTransactions(page);
  const heading = <PageHeading title="Transactions" />;

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
                    <time dateTime={transaction.createdAt}>{formatDateTime(transaction.createdAt)}</time>
                  </small>
                </div>
                <div className="transaction-value">
                  <strong>{formatCurrency(transaction.amount)}</strong>
                  <span className={`status-pill status-${transaction.status.toLowerCase()}`}>
                    {statusLabels[transaction.status]}
                  </span>
                </div>
              </li>
            ))}
          </ul>
          {pages > 1 ? (
            <nav className="pagination" aria-label="Transaction pages">
              <button className="small-button" type="button" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                Newer
              </button>
              <span>
                Page {page} of {pages}
              </span>
              <button className="small-button" type="button" disabled={page >= pages} onClick={() => setPage(page + 1)}>
                Older
              </button>
            </nav>
          ) : null}
        </>
      ) : (
        <EmptyState title="No transactions yet" description="Your rewards and payments will appear here." />
      )}
    </>
  );
}
