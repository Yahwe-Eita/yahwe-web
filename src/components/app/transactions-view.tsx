"use client";

import { EmptyState } from "@/components/app/empty-state";
import { PageHeading } from "@/components/app/page-heading";
import { QueryError, QueryLoading } from "@/components/app/query-state";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { useTransactions } from "@/hooks/useTransactions";
import { formatRelativeTime } from "@/lib/format";

export function TransactionsView() {
  const transactionsQuery = useTransactions();
  if (transactionsQuery.isPending) return <QueryLoading />;
  if (transactionsQuery.error) return <QueryError error={transactionsQuery.error} retry={() => transactionsQuery.refetch()} />;

  const { transactions } = transactionsQuery.data;
  return (
    <>
      <PageHeading title="Transaction History" />
      {transactions.length ? (
        <Stagger className="transaction-list">
          {transactions.map((transaction) => (
            <StaggerItem key={transaction.id}>
              <article className="transaction-row">
                <span className={`transaction-icon ${transaction.type === "AIRTIME" ? "airtime" : "cash"}`}>{transaction.type === "AIRTIME" ? "A" : "₵"}</span>
                <div className="transaction-main">
                  <strong>{transaction.type}</strong>
                  <span>{transaction.description}</span>
                  <small>{formatRelativeTime(transaction.createdAt)} · {transaction.reference}</small>
                </div>
                <div className="transaction-value">
                  <strong>GH₵ {transaction.amount}</strong>
                  <span className={`status-pill status-${(transaction.status ?? "pending").toLowerCase()}`}>{transaction.status ?? "Pending"}</span>
                </div>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      ) : (
        <EmptyState title="No transaction yet." description="You haven't invited anyone yet." />
      )}
    </>
  );
}
