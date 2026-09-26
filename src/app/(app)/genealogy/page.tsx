import type { Metadata } from "next";
import { GenealogyView } from "@/components/app/genealogy-view";
import { getProgramme } from "@/lib/server/programme";

export const metadata: Metadata = { title: "Genealogy" };

export default async function GenealogyPage() {
  const programme = await getProgramme();
  return <GenealogyView depthLimit={programme.depthLimit} />;
}
