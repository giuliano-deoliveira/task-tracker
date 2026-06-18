import type { JSONContent } from "@tiptap/core";

export type PageId = string;
export type TaskId = string;
export type DateKey = string; // "YYYY-MM-DD"

export type TaskStatus = "todo" | "done" | "rolled";

export interface Task {
  id: TaskId;
  text: string;
  status: TaskStatus;
  createdAt: string;
  completedAt?: string;
  rolledFromDate?: DateKey;
  rolledToDate?: DateKey;
}

export interface BasePage {
  id: PageId;
  dateKey: DateKey;
  title: string;
  createdAt: string;
  updatedAt: string;
  order: number;
}

export interface CornellPage extends BasePage {
  type: "cornell";
  cue: JSONContent;
  notes: JSONContent;
  summary: JSONContent;
}

export interface TaskPage extends BasePage {
  type: "task";
  tasks: Task[];
}

export type Page = CornellPage | TaskPage;

export interface PlannerState {
  pages: Record<PageId, Page>;
  pageIdsByDate: Record<DateKey, PageId[]>;
}
