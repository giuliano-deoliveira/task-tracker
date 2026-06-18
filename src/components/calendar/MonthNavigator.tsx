"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useUIStore } from "@/store/uiStore";
import { formatMonthDisplay, prevMonthKey, nextMonthKey } from "@/lib/dateUtils";

export function MonthNavigator() {
  const calendarViewMonth = useUIStore((s) => s.calendarViewMonth);
  const setCalendarViewMonth = useUIStore((s) => s.setCalendarViewMonth);

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
      <button
        onClick={() => setCalendarViewMonth(prevMonthKey(calendarViewMonth))}
        style={{ padding: 4, borderRadius: 6, border: "none", background: "none", cursor: "pointer", color: "#6B7280", display: "flex" }}
      >
        <ChevronLeft size={16} />
      </button>
      <span style={{ fontSize: "12px", fontWeight: 600, color: "#1A1A1A", letterSpacing: "0.02em" }}>
        {formatMonthDisplay(calendarViewMonth)}
      </span>
      <button
        onClick={() => setCalendarViewMonth(nextMonthKey(calendarViewMonth))}
        style={{ padding: 4, borderRadius: 6, border: "none", background: "none", cursor: "pointer", color: "#6B7280", display: "flex" }}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
