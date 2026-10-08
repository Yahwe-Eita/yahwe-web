import type { ReactNode } from "react";

type SettingsGroupProps =
  | { as: "fieldset"; legend: string; children: ReactNode }
  | { as: "nav"; label: string; children: ReactNode };

export function SettingsGroup(props: SettingsGroupProps) {
  if (props.as === "nav") {
    return (
      <nav className="settings-group" aria-label={props.label}>
        {props.children}
      </nav>
    );
  }
  return (
    <fieldset className="settings-group">
      <legend>{props.legend}</legend>
      {props.children}
    </fieldset>
  );
}
