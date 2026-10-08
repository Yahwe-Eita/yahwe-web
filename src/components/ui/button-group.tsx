import type { ReactNode } from "react";

const buttonGroupClassNames = {
  row: "button-row",
  hero: "landing-actions",
  join: "join-actions",
  menu: "landing-menu-actions",
  onboarding: "onboarding-actions",
  credentials: "credential-actions",
  profile: "profile-actions",
} as const;

export type ButtonGroupVariant = keyof typeof buttonGroupClassNames;

export function buttonGroupClassName(variant: ButtonGroupVariant) {
  return buttonGroupClassNames[variant];
}

export function ButtonGroup({ variant = "row", children }: { variant?: ButtonGroupVariant; children: ReactNode }) {
  return <div className={buttonGroupClassName(variant)}>{children}</div>;
}
