import { nanoid } from "nanoid";
import type { Page, TaskPage, Task, DateKey, PageId } from "@/types";

export function computeRolledTasks(
  pages: Record<PageId, Page>,
  pageIdsByDate: Record<DateKey, PageId[]>,
  targetDate: DateKey
): { updatedPages: Record<PageId, Page>; updatedIndex: Record<DateKey, PageId[]> } | null {
  const updatedPages = { ...pages };
  const updatedIndex = { ...pageIdsByDate };

  const rolledTasks: Task[] = [];

  for (const page of Object.values(pages)) {
    if (page.type !== "task") continue;
    for (const task of page.tasks) {
      if (task.status !== "rolled" || task.rolledToDate !== targetDate) continue;
      const targetPageIds = pageIdsByDate[targetDate] || [];
      const alreadyExists = targetPageIds.some((pid) => {
        const p = pages[pid];
        if (p?.type !== "task") return false;
        return p.tasks.some((t) => t.rolledFromDate === page.dateKey && t.text === task.text);
      });
      if (!alreadyExists) {
        rolledTasks.push({
          id: nanoid(),
          text: task.text,
          status: "todo",
          createdAt: new Date().toISOString(),
          rolledFromDate: page.dateKey,
        });
      }
    }
  }

  if (rolledTasks.length === 0) return null;

  const existingTaskPageId = (pageIdsByDate[targetDate] || []).find(
    (pid) => pages[pid]?.type === "task"
  );

  if (existingTaskPageId) {
    const existing = updatedPages[existingTaskPageId] as TaskPage;
    updatedPages[existingTaskPageId] = {
      ...existing,
      tasks: [...rolledTasks, ...existing.tasks],
      updatedAt: new Date().toISOString(),
    };
  } else {
    const newPageId = nanoid();
    const newPage: TaskPage = {
      id: newPageId,
      type: "task",
      dateKey: targetDate,
      title: "Tasks",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      order: pageIdsByDate[targetDate]?.length || 0,
      tasks: rolledTasks,
    };
    updatedPages[newPageId] = newPage;
    updatedIndex[targetDate] = [newPageId, ...(updatedIndex[targetDate] || [])];
  }

  return { updatedPages, updatedIndex };
}
