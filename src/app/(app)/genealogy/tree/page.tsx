import type { Metadata } from "next";
import { GenealogyTreeView } from "@/components/app/genealogy-tree-view";

export const metadata: Metadata = { title: "Genealogy" };

export default function GenealogyTreePage() {
  return <GenealogyTreeView />;
}
