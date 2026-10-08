import Link from "next/link";
import { Icon, type IconName } from "@/components/icon";

const iconLinkClassNames = { header: "header-icon", back: "back-link" } as const;

export type IconLinkVariant = keyof typeof iconLinkClassNames;

export function iconLinkClassName(variant: IconLinkVariant) {
  return iconLinkClassNames[variant];
}

export function IconLink({
  href,
  label,
  icon,
  size = 22,
  variant = "header",
}: {
  href: string;
  label: string;
  icon: IconName;
  size?: number;
  variant?: IconLinkVariant;
}) {
  return (
    <Link className={iconLinkClassName(variant)} href={href} aria-label={label}>
      <Icon name={icon} size={size} />
    </Link>
  );
}
