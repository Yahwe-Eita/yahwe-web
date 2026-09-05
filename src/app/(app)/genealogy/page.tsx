import type { Metadata } from "next";
import { GenealogyView } from "@/components/app/genealogy-view";

export const metadata: Metadata = { title: "Genealogy" };

export default function GenealogyPage() {
  return <GenealogyView />;
}
