export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidTime(timeStr: string): boolean {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(timeStr);
}

export function isWeekday(dateStr: string): boolean {
  const date = new Date(`${dateStr}T12:00:00`);
  const day = date.getDay();
  return day >= 1 && day <= 5;
}

export function isFutureOrTodayDate(dateStr: string, timeZone = "Africa/Johannesburg"): boolean {
  const todayStr = new Date().toLocaleDateString("en-CA", { timeZone });
  return dateStr >= todayStr;
}
