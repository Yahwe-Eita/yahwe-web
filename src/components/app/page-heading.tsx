import type { ReactNode } from "react";

export function PageHeading({
  greeting,
  title,
  description,
  action,
}: {
  greeting?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        {greeting ? <p className="page-greeting">{greeting}</p> : null}
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </div>
      {action ? <div className="page-heading-action">{action}</div> : null}
    </div>
  );
}
