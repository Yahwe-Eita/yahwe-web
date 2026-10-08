import type { ReactNode } from "react";

export function initialOf(name: string) {
  return name.charAt(0).toUpperCase();
}

const avatarClassNames = { person: "person-avatar", profile: "profile-avatar" } as const;

export type AvatarSize = keyof typeof avatarClassNames;

export function Avatar({
  name,
  children,
  size = "person",
}: {
  name?: string;
  children?: ReactNode;
  size?: AvatarSize;
}) {
  return (
    <span className={avatarClassNames[size]} aria-hidden="true">
      {children ?? (name ? initialOf(name) : null)}
    </span>
  );
}
