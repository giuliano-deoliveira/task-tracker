"use client";
import { create } from "zustand";
import { todayKey, monthKey } from "@/lib/dateUtils";

interface UIStore {
  selectedDate: string;
  activePageId: string | null;
  calendarViewMonth: string;
  sidebarCollapsed: boolean;

  setSelectedDate: (date: string) => void;
  setActivePageId: (id: string | null) => void;
  setCalendarViewMonth: (month: string) => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIStore>((set) => {
  const today = todayKey();
  return {
    selectedDate: today,
    activePageId: null,
    calendarViewMonth: monthKey(today),
    sidebarCollapsed: false,

    setSelectedDate: (date) => set({ selectedDate: date, calendarViewMonth: monthKey(date) }),
    setActivePageId: (id) => set({ activePageId: id }),
    setCalendarViewMonth: (month) => set({ calendarViewMonth: month }),
    toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  };
});
