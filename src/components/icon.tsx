"use client";

import { addCollection, Icon as OfflineIcon } from "@iconify/react/offline";
import mingcute from "@/components/icons/mingcute.json";

addCollection(mingcute);

/** Icons are bundled from the MingCute set; add a name to icons/mingcute.json before using it. */
export type IconName = `mingcute:${keyof typeof mingcute.icons}`;

export function Icon({
  name,
  size = 20,
  className,
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  return <OfflineIcon icon={name} width={size} height={size} className={className} aria-hidden="true" />;
}
