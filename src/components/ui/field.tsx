import type { ReactNode } from "react";

export interface FieldProps {
  label: ReactNode;
  hint?: ReactNode;
  /** Set when the control is not a direct child the label can wrap, such as an input beside a toggle. */
  htmlFor?: string;
  children: ReactNode;
}

export function Field({ label, hint, htmlFor, children }: FieldProps) {
  const hintNode = hint ? <small>{hint}</small> : null;
  if (htmlFor) {
    return (
      <div className="field">
        <label htmlFor={htmlFor}>{label}</label>
        {children}
        {hintNode}
      </div>
    );
  }
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      {hintNode}
    </label>
  );
}
