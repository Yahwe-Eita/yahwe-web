import type { ReactNode } from "react";

export type MessageTone = "error" | "success" | "info";

export function messageClassName(tone: MessageTone) {
  return `form-message form-message-${tone}`;
}

export function Notice({ tone = "info", children }: { tone?: MessageTone; children: ReactNode }) {
  return <p className={messageClassName(tone)}>{children}</p>;
}
