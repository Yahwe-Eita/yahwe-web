import type { ReactNode } from "react";

export function MemberRow({
  as: Element = "article",
  avatar,
  trailing,
  children,
}: {
  as?: "article" | "li";
  avatar: ReactNode;
  trailing?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Element className="member-row">
      {avatar}
      <div>{children}</div>
      {trailing}
    </Element>
  );
}
