import type { Metadata } from "next";
import { TransactionsView } from "@/components/app/transactions-view";

export const metadata: Metadata = { title: "Transaction History" };

export default function TransactionsPage() {
  return <TransactionsView />;
}
