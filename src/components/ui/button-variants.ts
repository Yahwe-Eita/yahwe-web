import { cx } from "@/components/ui/class-names";

export const buttonClassNames = {
  primary: "button button-primary",
  secondary: "button button-secondary",
  submit: "submit-button",
  network: "submit-button network-badge",
  action: "primary-action",
  small: "small-button",
  muted: "small-button small-button-muted",
  whatsapp: "small-button whatsapp-button",
  danger: "danger-button",
  icon: "icon-button",
  menu: "landing-menu-button",
  logout: "logout-button",
} as const;

export type ButtonVariant = keyof typeof buttonClassNames;

export function buttonClassName(variant: ButtonVariant, className?: string) {
  return cx(buttonClassNames[variant], className);
}
