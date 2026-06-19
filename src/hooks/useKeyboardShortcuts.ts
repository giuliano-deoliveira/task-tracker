"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUIStore } from "@/store/uiStore";
import { usePlannerStore } from "@/store/plannerStore";
import { nextDayKey, prevDayKey } from "@/lib/dateUtils";

export function useKeyboardShortcuts() {
  const router = useRouter();
  const selectedDate = useUIStore((s) => s.selectedDate);
  const setActivePageId = useUIStore((s) => s.setActivePageId);
  const setShortcutsOpen = useUIStore((s) => s.setShortcutsOpen);
  const addPage = usePlannerStore((s) => s.addPage);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isEditing = target.isContentEditable || target.tagName === "INPUT" || target.tagName === "TEXTAREA";

      if (e.key === "]" && !e.metaKey && !e.ctrlKey && !isEditing) {
        router.push(`/planner/${nextDayKey(selectedDate)}`);
      }
      if (e.key === "[" && !e.metaKey && !e.ctrlKey && !isEditing) {
        router.push(`/planner/${prevDayKey(selectedDate)}`);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "n") {
        e.preventDefault();
        const id = addPage(selectedDate, "cornell");
        setActivePageId(id);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "t") {
        e.preventDefault();
        const id = addPage(selectedDate, "task");
        setActivePageId(id);
      }
      if (e.key === "?" && !isEditing) {
        setShortcutsOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedDate, router, addPage, setActivePageId, setShortcutsOpen]);
}
