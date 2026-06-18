"use client";
import { useEffect } from "react";
import { useUIStore } from "@/store/uiStore";
import { usePlannerStore } from "@/store/plannerStore";

export function usePlannerDate(dateKey: string) {
  const setSelectedDate = useUIStore((s) => s.setSelectedDate);
  const setActivePageId = useUIStore((s) => s.setActivePageId);
  const applyRolledTasks = usePlannerStore((s) => s.applyRolledTasks);
  const pageIdsByDate = usePlannerStore((s) => s.pageIdsByDate);

  useEffect(() => {
    setSelectedDate(dateKey);
    applyRolledTasks(dateKey);
    const ids = pageIdsByDate[dateKey] || [];
    setActivePageId(ids[0] || null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateKey]);
}
