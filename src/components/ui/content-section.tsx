import type { ReactNode } from "react";

export function ContentSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="content-section">
      <div className="section-row">
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}
