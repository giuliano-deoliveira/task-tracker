"use client";
import { CalendarDay } from "./CalendarDay";
import { MonthNavigator } from "./MonthNavigator";
import { useUIStore } from "@/store/uiStore";
import { usePlannerStore } from "@/store/plannerStore";
import { getDaysInMonth, getMonthStartOffset, dateToKey, isTodayKey, isSameMonthKey } from "@/lib/dateUtils";

const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export function MiniCalendar() {
  const calendarViewMonth = useUIStore((s) => s.calendarViewMonth);
  const selectedDate = useUIStore((s) => s.selectedDate);
  const pageIdsByDate = usePlannerStore((s) => s.pageIdsByDate);

  const days = getDaysInMonth(calendarViewMonth);
  const startOffset = getMonthStartOffset(calendarViewMonth);

  return (
    <div>
      <MonthNavigator />

      {/* Day labels */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: 4 }}>
        {DAY_LABELS.map((d) => (
          <div
            key={d}
            style={{ textAlign: "center", fontSize: "10px", color: "#9CA3AF", fontWeight: 600, padding: "2px 0" }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px 0" }}>
        {/* Empty cells for offset */}
        {Array.from({ length: startOffset }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {days.map((date) => {
          const key = dateToKey(date);
          return (
            <div key={key} style={{ display: "flex", justifyContent: "center" }}>
              <CalendarDay
                date={date}
                isToday={isTodayKey(key)}
                isSelected={key === selectedDate}
                isCurrentMonth={isSameMonthKey(key, calendarViewMonth)}
                hasPages={!!(pageIdsByDate[key]?.length)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
