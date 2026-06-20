export function formatDate(dateStr: string, timeZone = "Africa/Johannesburg"): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-ZA", {
    timeZone,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
