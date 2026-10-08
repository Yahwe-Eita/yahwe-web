import type { ComponentProps, ReactNode } from "react";
import { VisuallyHidden } from "@/components/ui/visually-hidden";

export function ScrollTable({ caption, children, ...props }: ComponentProps<"table"> & { caption: ReactNode }) {
  return (
    <div className="table-scroll">
      <table {...props}>
        <VisuallyHidden as="caption">{caption}</VisuallyHidden>
        {children}
      </table>
    </div>
  );
}
