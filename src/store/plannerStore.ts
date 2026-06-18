"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { nanoid } from "nanoid";
import { idbStorage } from "@/lib/persistence";
import { computeRolledTasks } from "@/lib/rollover";
import type { Page, PageId, TaskPage, CornellPage, DateKey, TaskId, TaskStatus } from "@/types";
import type { JSONContent } from "@tiptap/core";

interface PlannerStore {
  pages: Record<PageId, Page>;
  pageIdsByDate: Record<DateKey, PageId[]>;

  addPage: (dateKey: DateKey, type: "cornell" | "task") => PageId;
  deletePage: (pageId: PageId) => void;
  updatePageTitle: (pageId: PageId, title: string) => void;
  updateCornellField: (pageId: PageId, field: "cue" | "notes" | "summary", content: JSONContent) => void;
  reorderPages: (dateKey: DateKey, orderedIds: PageId[]) => void;
  addTask: (pageId: PageId, text: string) => void;
  updateTaskText: (pageId: PageId, taskId: TaskId, text: string) => void;
  toggleTaskStatus: (pageId: PageId, taskId: TaskId) => void;
  setTaskRollover: (pageId: PageId, taskId: TaskId, nextDateKey: DateKey) => void;
  removeRollover: (pageId: PageId, taskId: TaskId) => void;
  deleteTask: (pageId: PageId, taskId: TaskId) => void;
  applyRolledTasks: (dateKey: DateKey) => void;
}

const emptyDoc: JSONContent = { type: "doc", content: [{ type: "paragraph" }] };

export const usePlannerStore = create<PlannerStore>()(
  persist(
    (set, get) => ({
      pages: {},
      pageIdsByDate: {},

      addPage: (dateKey, type) => {
        const id = nanoid();
        const now = new Date().toISOString();
        const existingIds = get().pageIdsByDate[dateKey] || [];
        const order = existingIds.length;

        const basePage = { id, dateKey, title: type === "cornell" ? "Notes" : "Tasks", createdAt: now, updatedAt: now, order };
        const page: Page = type === "cornell"
          ? { ...basePage, type: "cornell", cue: emptyDoc, notes: emptyDoc, summary: emptyDoc }
          : { ...basePage, type: "task", tasks: [] };

        set((s) => ({
          pages: { ...s.pages, [id]: page },
          pageIdsByDate: { ...s.pageIdsByDate, [dateKey]: [...existingIds, id] },
        }));
        return id;
      },

      deletePage: (pageId) => {
        const page = get().pages[pageId];
        if (!page) return;
        set((s) => {
          const pages = { ...s.pages };
          delete pages[pageId];
          const ids = (s.pageIdsByDate[page.dateKey] || []).filter((id) => id !== pageId);
          return { pages, pageIdsByDate: { ...s.pageIdsByDate, [page.dateKey]: ids } };
        });
      },

      updatePageTitle: (pageId, title) => {
        set((s) => ({
          pages: { ...s.pages, [pageId]: { ...s.pages[pageId], title, updatedAt: new Date().toISOString() } },
        }));
      },

      updateCornellField: (pageId, field, content) => {
        set((s) => {
          const page = s.pages[pageId] as CornellPage;
          if (!page || page.type !== "cornell") return s;
          return { pages: { ...s.pages, [pageId]: { ...page, [field]: content, updatedAt: new Date().toISOString() } } };
        });
      },

      reorderPages: (dateKey, orderedIds) => {
        set((s) => {
          const pages = { ...s.pages };
          orderedIds.forEach((id, idx) => {
            if (pages[id]) pages[id] = { ...pages[id], order: idx };
          });
          return { pages, pageIdsByDate: { ...s.pageIdsByDate, [dateKey]: orderedIds } };
        });
      },

      addTask: (pageId, text) => {
        const id = nanoid();
        const task = { id, text, status: "todo" as TaskStatus, createdAt: new Date().toISOString() };
        set((s) => {
          const page = s.pages[pageId] as TaskPage;
          if (!page || page.type !== "task") return s;
          return { pages: { ...s.pages, [pageId]: { ...page, tasks: [...page.tasks, task], updatedAt: new Date().toISOString() } } };
        });
      },

      updateTaskText: (pageId, taskId, text) => {
        set((s) => {
          const page = s.pages[pageId] as TaskPage;
          if (!page || page.type !== "task") return s;
          return { pages: { ...s.pages, [pageId]: { ...page, tasks: page.tasks.map((t) => t.id === taskId ? { ...t, text } : t) } } };
        });
      },

      toggleTaskStatus: (pageId, taskId) => {
        set((s) => {
          const page = s.pages[pageId] as TaskPage;
          if (!page || page.type !== "task") return s;
          return {
            pages: {
              ...s.pages,
              [pageId]: {
                ...page,
                tasks: page.tasks.map((t) => {
                  if (t.id !== taskId) return t;
                  const isDone = t.status === "done";
                  return { ...t, status: isDone ? "todo" : "done", completedAt: isDone ? undefined : new Date().toISOString() };
                }),
                updatedAt: new Date().toISOString(),
              },
            },
          };
        });
      },

      setTaskRollover: (pageId, taskId, nextDateKey) => {
        set((s) => {
          const page = s.pages[pageId] as TaskPage;
          if (!page || page.type !== "task") return s;
          return {
            pages: {
              ...s.pages,
              [pageId]: {
                ...page,
                tasks: page.tasks.map((t) =>
                  t.id === taskId ? { ...t, status: "rolled" as TaskStatus, rolledToDate: nextDateKey } : t
                ),
              },
            },
          };
        });
      },

      removeRollover: (pageId, taskId) => {
        set((s) => {
          const page = s.pages[pageId] as TaskPage;
          if (!page || page.type !== "task") return s;
          return {
            pages: {
              ...s.pages,
              [pageId]: {
                ...page,
                tasks: page.tasks.map((t) =>
                  t.id === taskId ? { ...t, status: "todo" as TaskStatus, rolledToDate: undefined } : t
                ),
              },
            },
          };
        });
      },

      deleteTask: (pageId, taskId) => {
        set((s) => {
          const page = s.pages[pageId] as TaskPage;
          if (!page || page.type !== "task") return s;
          return { pages: { ...s.pages, [pageId]: { ...page, tasks: page.tasks.filter((t) => t.id !== taskId) } } };
        });
      },

      applyRolledTasks: (dateKey) => {
        const { pages, pageIdsByDate } = get();
        const result = computeRolledTasks(pages, pageIdsByDate, dateKey);
        if (result) {
          set({ pages: result.updatedPages, pageIdsByDate: result.updatedIndex });
        }
      },
    }),
    {
      name: "planner-state",
      storage: createJSONStorage(() => idbStorage),
    }
  )
);
