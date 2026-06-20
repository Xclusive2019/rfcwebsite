import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { toast } from "sonner";

const TIME_SLOTS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatDateLocal(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// Anonymous Gregorian algorithm for Easter Sunday
function getEaster(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

// Returns a Set of "YYYY-MM-DD" strings for SA public holidays in a given year.
// When a fixed holiday falls on Sunday, the Monday substitute is included.
function getSAHolidays(year: number): Set<string> {
  const result = new Set<string>();

  function addFixed(month: number, day: number) {
    const d = new Date(year, month - 1, day);
    result.add(formatDateLocal(d));
    // Sunday → substitute Monday
    if (d.getDay() === 0) {
      const mon = new Date(d);
      mon.setDate(d.getDate() + 1);
      result.add(formatDateLocal(mon));
    }
  }

  addFixed(1, 1);   // New Year's Day
  addFixed(3, 21);  // Human Rights Day
  addFixed(4, 27);  // Freedom Day
  addFixed(5, 1);   // Workers' Day
  addFixed(6, 16);  // Youth Day
  addFixed(8, 9);   // National Women's Day
  addFixed(9, 24);  // Heritage Day
  addFixed(12, 16); // Day of Reconciliation
  addFixed(12, 25); // Christmas Day
  addFixed(12, 26); // Day of Goodwill

  const easter = getEaster(year);
  const goodFriday = new Date(easter);
  goodFriday.setDate(easter.getDate() - 2);
  const familyDay = new Date(easter);
  familyDay.setDate(easter.getDate() + 1);
  result.add(formatDateLocal(goodFriday));
  result.add(formatDateLocal(familyDay));

  return result;
}

// Returns working days (Mon–Fri, excluding SA holidays) starting tomorrow, up to `n` days
function getWorkingDays(n = 60): Date[] {
  const days: Date[] = [];
  const today = new Date();
  const holidayCache: Map<number, Set<string>> = new Map();

  function isHoliday(d: Date) {
    const y = d.getFullYear();
    if (!holidayCache.has(y)) holidayCache.set(y, getSAHolidays(y));
    return holidayCache.get(y)!.has(formatDateLocal(d));
  }

  for (let i = 1; days.length < n; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6 && !isHoliday(d)) days.push(d);
    if (i > 200) break;
  }
  return days;
}

function isSAHoliday(d: Date): boolean {
  return getSAHolidays(d.getFullYear()).has(formatDateLocal(d));
}

// All working days within the same calendar week as `d`
function workingDaysInWeek(d: Date): Date[] {
  const monday = new Date(d);
  monday.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  const days: Date[] = [];
  for (let i = 0; i < 5; i++) {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    if (!isSAHoliday(day)) days.push(day);
  }
  return days;
}

// All working days within the same calendar month as `d`
function workingDaysInMonth(d: Date): Date[] {
  const days: Date[] = [];
  const cur = new Date(d.getFullYear(), d.getMonth(), 1);
  while (cur.getMonth() === d.getMonth()) {
    const dow = cur.getDay();
    if (dow !== 0 && dow !== 6 && !isSAHoliday(cur)) {
      days.push(new Date(cur));
    }
    cur.setDate(cur.getDate() + 1);
  }
  return days;
}

interface BlockedSlot {
  id: string;
  available_date: string;
  start_time: string;
  is_available: boolean;
}

export default function AdminAvailabilityPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([]);
  const [saving, setSaving] = useState<string | null>(null);
  const [bulkWorking, setBulkWorking] = useState(false);

  const days = getWorkingDays(60);

  useEffect(() => {
    supabase
      .from("booking_availability")
      .select("id, available_date, start_time, is_available")
      .eq("is_available", false)
      .then(({ data }) => setBlockedSlots((data as BlockedSlot[]) ?? []));
  }, []);

  function isBlocked(date: Date, time: string) {
    const dateStr = formatDateLocal(date);
    return blockedSlots.some(
      (s) => s.available_date === dateStr && s.start_time.slice(0, 5) === time && !s.is_available
    );
  }

  function isDayFullyBlocked(date: Date) {
    return TIME_SLOTS.every((t) => isBlocked(date, t));
  }

  async function toggleSlot(date: Date, time: string) {
    const dateStr = formatDateLocal(date);
    const key = `${dateStr}-${time}`;
    setSaving(key);

    const existing = blockedSlots.find(
      (s) => s.available_date === dateStr && s.start_time.slice(0, 5) === time
    );

    if (existing) {
      const { error } = await supabase.from("booking_availability").delete().eq("id", existing.id);
      if (error) {
        toast.error("Failed to update slot");
      } else {
        setBlockedSlots((prev) => prev.filter((s) => s.id !== existing.id));
        toast.success(`${time} on ${dateStr} re-opened`);
      }
    } else {
      const { data, error } = await supabase
        .from("booking_availability")
        .insert({ available_date: dateStr, start_time: time, end_time: time, is_available: false })
        .select()
        .single();
      if (error) {
        toast.error("Failed to block slot");
      } else {
        setBlockedSlots((prev) => [...prev, data as BlockedSlot]);
        toast.success(`${time} on ${dateStr} blocked`);
      }
    }
    setSaving(null);
  }

  // Block all slots for a set of dates that aren't already blocked
  async function blockDates(dates: Date[], label: string) {
    setBulkWorking(true);
    const toInsert: { available_date: string; start_time: string; end_time: string; is_available: boolean }[] = [];

    for (const d of dates) {
      for (const t of TIME_SLOTS) {
        if (!isBlocked(d, t)) {
          toInsert.push({ available_date: formatDateLocal(d), start_time: t, end_time: t, is_available: false });
        }
      }
    }

    if (toInsert.length === 0) {
      toast.info("All slots already blocked");
      setBulkWorking(false);
      return;
    }

    const { data, error } = await supabase
      .from("booking_availability")
      .insert(toInsert)
      .select();

    if (error) {
      toast.error("Bulk block failed: " + error.message);
    } else {
      setBlockedSlots((prev) => [...prev, ...((data as BlockedSlot[]) ?? [])]);
      toast.success(`${label} blocked (${toInsert.length} slots)`);
    }
    setBulkWorking(false);
  }

  // Unblock all slots for a set of dates
  async function unblockDates(dates: Date[], label: string) {
    setBulkWorking(true);
    const dateStrs = dates.map(formatDateLocal);
    const toDelete = blockedSlots.filter((s) => dateStrs.includes(s.available_date));

    if (toDelete.length === 0) {
      toast.info("No blocked slots to unblock");
      setBulkWorking(false);
      return;
    }

    const { error } = await supabase
      .from("booking_availability")
      .delete()
      .in("id", toDelete.map((s) => s.id));

    if (error) {
      toast.error("Bulk unblock failed: " + error.message);
    } else {
      const ids = new Set(toDelete.map((s) => s.id));
      setBlockedSlots((prev) => prev.filter((s) => !ids.has(s.id)));
      toast.success(`${label} unblocked`);
    }
    setBulkWorking(false);
  }

  async function handleBlockDay(unblock = false) {
    if (!selectedDate) return;
    if (unblock) await unblockDates([selectedDate], formatDateLocal(selectedDate));
    else await blockDates([selectedDate], formatDateLocal(selectedDate));
  }

  async function handleBlockWeek(unblock = false) {
    if (!selectedDate) return;
    const weekDays = workingDaysInWeek(selectedDate);
    const label = `Week of ${DAY_NAMES[selectedDate.getDay()]} ${selectedDate.getDate()} ${MONTH_NAMES[selectedDate.getMonth()]}`;
    if (unblock) await unblockDates(weekDays, label);
    else await blockDates(weekDays, label);
  }

  async function handleBlockMonth(unblock = false) {
    if (!selectedDate) return;
    const monthDays = workingDaysInMonth(selectedDate);
    const label = `${MONTH_NAMES[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;
    if (unblock) await unblockDates(monthDays, label);
    else await blockDates(monthDays, label);
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Booking Availability</h1>
        <p className="text-sm text-gray-500 mt-1">
          Click a slot to toggle it. Weekends and South African public holidays are automatically excluded.
        </p>
      </div>

      <div className="flex gap-6">
        {/* Date list */}
        <div className="w-52 shrink-0">
          <p className="text-xs font-semibold uppercase text-gray-400 mb-3 tracking-wider">Select a date</p>
          <div className="space-y-1 max-h-[600px] overflow-y-auto pr-1">
            {days.map((d) => {
              const dateStr = formatDateLocal(d);
              const blockedCount = blockedSlots.filter((s) => s.available_date === dateStr).length;
              const fullyBlocked = blockedCount === TIME_SLOTS.length;
              const isSel = selectedDate && formatDateLocal(selectedDate) === dateStr;
              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDate(d)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors flex justify-between items-center ${
                    isSel
                      ? "bg-[#4A7C2F] text-white"
                      : fullyBlocked
                      ? "bg-red-50 text-red-700 hover:bg-red-100"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <span>
                    {DAY_NAMES[d.getDay()]} {d.getDate()} {MONTH_NAMES[d.getMonth()]}
                  </span>
                  {blockedCount > 0 && (
                    <span
                      className={`text-xs rounded-full px-1.5 py-0.5 ${
                        isSel
                          ? "bg-white/20 text-white"
                          : fullyBlocked
                          ? "bg-red-200 text-red-800"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {fullyBlocked ? "Closed" : `${blockedCount}`}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right panel */}
        <div className="flex-1 space-y-4">
          {!selectedDate ? (
            <div className="bg-white rounded-xl border border-gray-200 flex items-center justify-center h-64">
              <p className="text-sm text-gray-400">Select a date to manage its time slots</p>
            </div>
          ) : (
            <>
              {/* Bulk actions */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <p className="text-xs font-semibold uppercase text-gray-400 tracking-wider mb-4">Quick Block</p>
                <div className="grid grid-cols-3 gap-3">
                  {/* Day */}
                  <div className="flex flex-col gap-2">
                    <p className="text-xs font-medium text-gray-600 text-center">
                      {DAY_NAMES[selectedDate.getDay()]} {selectedDate.getDate()} {MONTH_NAMES[selectedDate.getMonth()]}
                    </p>
                    <button
                      disabled={bulkWorking}
                      onClick={() => handleBlockDay(false)}
                      className="w-full py-2 rounded-lg text-xs font-medium border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-50 transition-colors"
                    >
                      Block Day
                    </button>
                    <button
                      disabled={bulkWorking}
                      onClick={() => handleBlockDay(true)}
                      className="w-full py-2 rounded-lg text-xs font-medium border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 disabled:opacity-50 transition-colors"
                    >
                      Unblock Day
                    </button>
                  </div>

                  {/* Week */}
                  <div className="flex flex-col gap-2">
                    <p className="text-xs font-medium text-gray-600 text-center">
                      Week of {selectedDate.getDate()} {MONTH_NAMES[selectedDate.getMonth()]}
                    </p>
                    <button
                      disabled={bulkWorking}
                      onClick={() => handleBlockWeek(false)}
                      className="w-full py-2 rounded-lg text-xs font-medium border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-50 transition-colors"
                    >
                      Block Week
                    </button>
                    <button
                      disabled={bulkWorking}
                      onClick={() => handleBlockWeek(true)}
                      className="w-full py-2 rounded-lg text-xs font-medium border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 disabled:opacity-50 transition-colors"
                    >
                      Unblock Week
                    </button>
                  </div>

                  {/* Month */}
                  <div className="flex flex-col gap-2">
                    <p className="text-xs font-medium text-gray-600 text-center">
                      {MONTH_NAMES[selectedDate.getMonth()]} {selectedDate.getFullYear()}
                    </p>
                    <button
                      disabled={bulkWorking}
                      onClick={() => handleBlockMonth(false)}
                      className="w-full py-2 rounded-lg text-xs font-medium border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-50 transition-colors"
                    >
                      Block Month
                    </button>
                    <button
                      disabled={bulkWorking}
                      onClick={() => handleBlockMonth(true)}
                      className="w-full py-2 rounded-lg text-xs font-medium border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 disabled:opacity-50 transition-colors"
                    >
                      Unblock Month
                    </button>
                  </div>
                </div>

                {bulkWorking && (
                  <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                    <span className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin" />
                    Applying…
                  </div>
                )}
              </div>

              {/* Time slot grid */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-5">
                  <p className="font-semibold text-gray-800">
                    {DAY_NAMES[selectedDate.getDay()]}, {selectedDate.getDate()}{" "}
                    {MONTH_NAMES[selectedDate.getMonth()]} {selectedDate.getFullYear()}
                  </p>
                  {isDayFullyBlocked(selectedDate) && (
                    <span className="text-xs font-medium bg-red-100 text-red-700 px-2.5 py-1 rounded-full">
                      Day closed
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {TIME_SLOTS.map((t) => {
                    const blocked = isBlocked(selectedDate, t);
                    const key = `${formatDateLocal(selectedDate)}-${t}`;
                    const isSaving = saving === key;
                    return (
                      <button
                        key={t}
                        disabled={isSaving || bulkWorking}
                        onClick={() => toggleSlot(selectedDate, t)}
                        className={`py-3 px-4 rounded-lg border text-sm font-medium transition-all flex items-center justify-between ${
                          blocked
                            ? "border-red-300 bg-red-50 text-red-700 hover:bg-red-100"
                            : "border-gray-200 bg-white text-gray-700 hover:border-[#4A7C2F]/50 hover:bg-[#4A7C2F]/5"
                        } disabled:opacity-50`}
                      >
                        <span>{t}</span>
                        {isSaving ? (
                          <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <span className={`material-icon text-[16px] ${blocked ? "text-red-500" : "text-green-500"}`}>
                            {blocked ? "block" : "check_circle"}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-400 mt-4">
                  Green = available &nbsp;·&nbsp; Red = blocked &nbsp;·&nbsp; SA public holidays & weekends always excluded
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
