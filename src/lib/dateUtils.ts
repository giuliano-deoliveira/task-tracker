import {
  format,
  addDays,
  subDays,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  parseISO,
  isToday,
  isSameMonth,
} from "date-fns";

export type DateKey = string;

export function todayKey(): DateKey {
  return format(new Date(), "yyyy-MM-dd");
}

export function parseKey(key: DateKey): Date {
  return parseISO(key);
}

export function formatDisplay(key: DateKey): string {
  return format(parseISO(key), "EEEE, MMMM d, yyyy");
}

export function formatShort(key: DateKey): string {
  return format(parseISO(key), "MMM d");
}

export function nextDayKey(key: DateKey): DateKey {
  return format(addDays(parseISO(key), 1), "yyyy-MM-dd");
}

export function prevDayKey(key: DateKey): DateKey {
  return format(subDays(parseISO(key), 1), "yyyy-MM-dd");
}

export function monthKey(key: DateKey): string {
  return format(parseISO(key), "yyyy-MM");
}

export function formatMonthDisplay(mk: string): string {
  return format(parseISO(mk + "-01"), "MMMM yyyy");
}

export function getDaysInMonth(mk: string): Date[] {
  const start = startOfMonth(parseISO(mk + "-01"));
  const end = endOfMonth(start);
  return eachDayOfInterval({ start, end });
}

export function getMonthStartOffset(mk: string): number {
  const start = startOfMonth(parseISO(mk + "-01"));
  return getDay(start);
}

export function dateToKey(date: Date): DateKey {
  return format(date, "yyyy-MM-dd");
}

export function isTodayKey(key: DateKey): boolean {
  return isToday(parseISO(key));
}

export function isSameMonthKey(key: DateKey, mk: string): boolean {
  return isSameMonth(parseISO(key), parseISO(mk + "-01"));
}

export function prevMonthKey(mk: string): string {
  const [year, month] = mk.split("-").map(Number);
  return format(new Date(year, month - 2, 1), "yyyy-MM");
}

export function nextMonthKey(mk: string): string {
  const [year, month] = mk.split("-").map(Number);
  return format(new Date(year, month, 1), "yyyy-MM");
}
