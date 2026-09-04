import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState } from "@/components/app/empty-state";
import { GenealogyTree } from "@/components/app/genealogy-tree";
import { PageHeading } from "@/components/app/page-heading";
import { getGenealogyData } from "@/lib/server/data";

export const metadata: Metadata = { title: "Genealogy tree" };

export default async function GenealogyTreePage() {
  const data = await getGenealogyData();
  return (
    <>
      <PageHeading
        eyebrow="Network map"
        title="Genealogy tree"
        action={<Link className="small-button" href="/genealogy">← Back to list</Link>}
      />
      {data ? (
        <GenealogyTree root={data} />
      ) : (
        <EmptyState title="No tree to display" description="Your genealogy tree will appear after your first member joins." />
      )}
    </>
  );
}
