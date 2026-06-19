import { nanoid } from "nanoid";
import { prevDayKey } from "@/lib/dateUtils";
import type { Page, TaskPage, Task, DateKey, PageId, TaskStatus } from "@/types";

export function computeRolledTasks(
  pages: Record<PageId, Page>,
  pageIdsByDate: Record<DateKey, PageId[]>,
  targetDate: DateKey
): { updatedPages: Record<PageId, Page>; updatedIndex: Record<DateKey, PageId[]> } | null {
  // Collect rolled tasks already on targetDate to avoid duplicates
  // Dedup key = "text||originalDate" where originalDate = rolledFromDate of the existing copy
  const existingKeys = new Set<string>();
  for (const pid of pageIdsByDate[targetDate] ?? []) {
    const p = pages[pid];
    if (p?.type !== "task") continue;
    for (const t of p.tasks) {
      if (t.rolledFromDate) {
        existingKeys.add(`${t.text}||${t.rolledFromDate}`);
      }
    }
  }

  // Scan up to 30 prior days for incomplete tasks not yet on targetDate
  const seenKeys = new Set<string>(existingKeys);
  const toAdd: Array<{ text: string; originalDate: DateKey; subtasks: Task["subtasks"] }> = [];

  let scanDate = prevDayKey(targetDate);
  for (let i = 0; i < 30; i++) {
    for (const pid of pageIdsByDate[scanDate] ?? []) {
      const p = pages[pid];
      if (p?.type !== "task") continue;
      for (const task of p.tasks) {
        if (task.status !== "todo") continue;
        const originalDate = task.rolledFromDate ?? p.dateKey;
        const key = `${task.text}||${originalDate}`;
        if (!seenKeys.has(key)) {
          seenKeys.add(key);
          toAdd.push({ text: task.text, originalDate, subtasks: task.subtasks });
        }
      }
    }
    scanDate = prevDayKey(scanDate);
  }

  if (toAdd.length === 0) return null;

  const updatedPages = { ...pages };
  const updatedIndex = { ...pageIdsByDate };
  const now = new Date().toISOString();

  const newTasks: Task[] = toAdd.map(({ text, originalDate, subtasks }) => ({
    id: nanoid(),
    text,
    status: "todo" as TaskStatus,
    createdAt: now,
    rolledFromDate: originalDate,
    subtasks: subtasks ? subtasks.map((st) => ({ ...st, id: nanoid() })) : undefined,
  }));

  const existingTaskPageId = (pageIdsByDate[targetDate] ?? []).find(
    (pid) => pages[pid]?.type === "task"
  );

  if (existingTaskPageId) {
    const existing = updatedPages[existingTaskPageId] as TaskPage;
    updatedPages[existingTaskPageId] = {
      ...existing,
      tasks: [...newTasks, ...existing.tasks],
      updatedAt: now,
    };
  } else {
    const newPageId = nanoid();
    const newPage: TaskPage = {
      id: newPageId,
      type: "task",
      dateKey: targetDate,
      title: "Tasks",
      createdAt: now,
      updatedAt: now,
      order: (pageIdsByDate[targetDate] ?? []).length,
      tasks: newTasks,
    };
    updatedPages[newPageId] = newPage;
    updatedIndex[targetDate] = [newPageId, ...(updatedIndex[targetDate] ?? [])];
  }

  return { updatedPages, updatedIndex };
}
