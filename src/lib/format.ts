export function formatCurrency(value?: number) {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    minimumFractionDigits: 2,
  }).format(Number(value ?? 0));
}

export function formatDate(value?: string) {
  if (!value) return "Unknown date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown date";
  return new Intl.DateTimeFormat("en-GH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function formatRelativeTime(value?: string) {
  if (!value) return "Invalid date";
  const timestamp = new Date(value).getTime();
  if (!Number.isFinite(timestamp)) return "Invalid date";
  const seconds = Math.round((Date.now() - timestamp) / 1000);
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
