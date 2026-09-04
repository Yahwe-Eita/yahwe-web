import type { Metadata } from "next";
import { EmptyState } from "@/components/app/empty-state";
import { PageHeading } from "@/components/app/page-heading";
import { RefreshButton } from "@/components/app/refresh-button";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { formatCurrency, formatDate } from "@/lib/format";
import { getTransactions } from "@/lib/server/data";

export const metadata: Metadata = { title: "Transactions" };

export default async function TransactionsPage() {
  const { transactions, total } = await getTransactions();
  return (
    <>
      <PageHeading
        eyebrow="Account activity"
        title="Transactions"
        description={`${total} transaction${total === 1 ? "" : "s"} recorded.`}
        action={<RefreshButton />}
      />
      {transactions.length ? (
        <Stagger className="transaction-list">
          {transactions.map((transaction) => (
            <StaggerItem key={transaction.id}>
            <article className="transaction-row">
              <span className={`transaction-icon ${transaction.type === "AIRTIME" ? "airtime" : "cash"}`}>
                {transaction.type === "AIRTIME" ? "A" : "₵"}
              </span>
              <div className="transaction-main">
                <strong>{transaction.type ?? "Transaction"}</strong>
                <span>{transaction.description ?? "Account transaction"}</span>
                <small>{formatDate(transaction.createdAt)} · {transaction.reference ?? "No reference"}</small>
              </div>
              <div className="transaction-value">
                <strong>{formatCurrency(transaction.amount)}</strong>
                <span className={`status-pill status-${(transaction.status ?? "pending").toLowerCase()}`}>
                  {transaction.status ?? "Pending"}
                </span>
              </div>
            </article>
            </StaggerItem>
          ))}
        </Stagger>
      ) : (
        <EmptyState title="No transactions yet" description="Airtime and cash reward activity will appear here." />
      )}
    </>
  );
}
