import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState } from "@/components/app/empty-state";
import { PageHeading } from "@/components/app/page-heading";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { getGenealogyData } from "@/lib/server/data";

export const metadata: Metadata = { title: "Genealogy" };

export default async function GenealogyPage() {
  const data = await getGenealogyData();
  const recruits = data?.recruits ?? [];

  return (
    <>
      <PageHeading
        eyebrow="Your network"
        title="Genealogy"
        description="Follow the members directly connected to your account."
        action={
          data ? (
            <Link className="primary-action" href="/genealogy/tree">
              View full tree
            </Link>
          ) : undefined
        }
      />
      {recruits.length ? (
        <Stagger className="list-grid">
          {recruits.map((recruit, index) => {
            const inactive =
              recruit.recruitWindowClosed === true ||
              recruit.recruitWindowClosed === "true";
            return (
              <StaggerItem key={recruit.id ?? `${recruit.name}-${index}`}>
              <article className="member-row">
                <span className="person-avatar">{recruit.name.charAt(0).toUpperCase()}</span>
                <div>
                  <strong>{recruit.name}</strong>
                  <small>{recruit.phone ?? "Downline member"}</small>
                </div>
                <span className={`status-pill ${inactive ? "status-inactive" : "status-active"}`}>
                  {inactive ? "Inactive" : "Active"}
                </span>
              </article>
              </StaggerItem>
            );
          })}
        </Stagger>
      ) : (
        <EmptyState title="No genealogy data yet" description="Your downlines will appear here after they join." />
      )}
    </>
  );
}
