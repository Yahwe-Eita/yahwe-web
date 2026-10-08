import type { Money } from "@/lib/api/types";

const currency = new Intl.NumberFormat("en-GH", {
  style: "currency",
  currency: "GHS",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** The only place a money amount becomes display text; rounds to 2 places here and nowhere else. */
export function formatCurrency(value: Money | undefined) {
  const amount = parseMoney(value);
  return amount === undefined ? "-" : currency.format(amount);
}

/** The same amount without the symbol, for tables that carry the symbol in a header. */
export function formatAmount(value: Money | undefined) {
  const amount = parseMoney(value);
  if (amount === undefined) return "-";
  return currency
    .formatToParts(amount)
    .filter((part) => part.type !== "currency" && part.type !== "literal")
    .map((part) => part.value)
    .join("");
}

export const currencySymbol = currency.formatToParts(0).find((part) => part.type === "currency")?.value ?? "";

function parseMoney(value: Money | undefined) {
  if (value === undefined || value.trim() === "") return undefined;
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : undefined;
}

const dateTime = new Intl.DateTimeFormat("en-GH", { dateStyle: "medium", timeStyle: "short" });

export function formatDateTime(value: string | undefined) {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : dateTime.format(date);
}

export function formatRelativeTime(value: string | undefined, now = Date.now()) {
  if (!value) return "-";
  const timestamp = new Date(value).getTime();
  if (!Number.isFinite(timestamp)) return "-";
  const seconds = Math.round((now - timestamp) / 1000);
  if (seconds < 45) return "a few seconds ago";
  if (seconds < 90) return "a minute ago";
  const minutes = Math.round(seconds / 60);
  if (minutes < 45) return `${minutes} minutes ago`;
  if (minutes < 90) return "an hour ago";
  const hours = Math.round(minutes / 60);
  if (hours < 22) return `${hours} hours ago`;
  if (hours < 36) return "a day ago";
  const days = Math.round(hours / 24);
  if (days < 26) return `${days} days ago`;
  if (days < 46) return "a month ago";
  if (days < 320) return `${Math.round(days / 30)} months ago`;
  if (days < 548) return "a year ago";
  return `${Math.round(days / 365)} years ago`;
}
