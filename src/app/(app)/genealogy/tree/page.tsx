import type { Metadata } from "next";
import { GenealogyTreeView } from "@/components/app/genealogy-tree-view";
import { getProgramme } from "@/lib/server/programme";

export const metadata: Metadata = { title: "Genealogy tree" };
export const dynamic = "force-dynamic";

export default async function GenealogyTreePage() {
  const programme = await getProgramme();
  return <GenealogyTreeView depthLimit={programme.depthLimit} />;
}
