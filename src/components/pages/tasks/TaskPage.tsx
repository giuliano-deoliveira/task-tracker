"use client";
import { AnimatePresence } from "framer-motion";
import type { TaskPage as TaskPageType } from "@/types";
import { usePlannerStore } from "@/store/plannerStore";
import { TaskItem } from "./TaskItem";
import { TaskInput } from "./TaskInput";
import { EditableTitle } from "../EditableTitle";

interface Props {
  page: TaskPageType;
}

const SECTION_LABEL_STYLE: React.CSSProperties = {
  padding: "8px 20px 4px",
  fontSize: "10px",
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
  color: "#9CA3AF",
};

const SECTION_DIVIDER_STYLE: React.CSSProperties = {
  height: 1,
  background: "#E2DFD8",
  margin: "4px 20px 0",
};

export function TaskPage({ page }: Props) {
  const addTask = usePlannerStore((s) => s.addTask);
  const toggleTaskStatus = usePlannerStore((s) => s.toggleTaskStatus);
  const updateTaskText = usePlannerStore((s) => s.updateTaskText);
  const deleteTask = usePlannerStore((s) => s.deleteTask);
  const updatePageTitle = usePlannerStore((s) => s.updatePageTitle);
  const addSubtask = usePlannerStore((s) => s.addSubtask);
  const toggleSubtask = usePlannerStore((s) => s.toggleSubtask);
  const updateSubtaskText = usePlannerStore((s) => s.updateSubtaskText);
  const deleteSubtask = usePlannerStore((s) => s.deleteSubtask);

  const incompleteTasks = page.tasks.filter((t) => t.status !== "done");
  const doneTasks = page.tasks.filter((t) => t.status === "done");

  // Split incomplete tasks into rolled (from previous days) and today (native)
  const rolledTasks = incompleteTasks.filter((t) => !!t.rolledFromDate);
  const todayTasks = incompleteTasks.filter((t) => !t.rolledFromDate);

  const taskItemProps = (taskId: string) => ({
    onToggle: () => toggleTaskStatus(page.id, taskId),
    onUpdateText: (text: string) => updateTaskText(page.id, taskId, text),
    onDelete: () => deleteTask(page.id, taskId),
    onAddSubtask: (text: string) => addSubtask(page.id, taskId, text),
    onToggleSubtask: (subtaskId: string) => toggleSubtask(page.id, taskId, subtaskId),
    onUpdateSubtaskText: (subtaskId: string, text: string) => updateSubtaskText(page.id, taskId, subtaskId, text),
    onDeleteSubtask: (subtaskId: string) => deleteSubtask(page.id, taskId, subtaskId),
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <div style={{ padding: "20px 20px 0", flexShrink: 0 }}>
        <EditableTitle title={page.title} onSave={(t) => updatePageTitle(page.id, t)} />
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* Rolled over section */}
        {rolledTasks.length > 0 && (
          <>
            <div style={SECTION_LABEL_STYLE}>Rolled Over</div>
            <div style={SECTION_DIVIDER_STYLE} />
            <AnimatePresence>
              {rolledTasks.map((task) => (
                <TaskItem key={task.id} task={task} {...taskItemProps(task.id)} />
              ))}
            </AnimatePresence>
          </>
        )}

        {/* Today's tasks */}
        {(todayTasks.length > 0 || rolledTasks.length === 0) && (
          <>
            {rolledTasks.length > 0 && (
              <>
                <div style={{ ...SECTION_LABEL_STYLE, marginTop: 8 }}>Today</div>
                <div style={SECTION_DIVIDER_STYLE} />
              </>
            )}
            <AnimatePresence>
              {todayTasks.map((task) => (
                <TaskItem key={task.id} task={task} {...taskItemProps(task.id)} />
              ))}
            </AnimatePresence>
            {todayTasks.length === 0 && rolledTasks.length > 0 && (
              <div style={{ padding: "12px 20px", fontSize: "13px", color: "#C8C3BA" }}>
                No new tasks today
              </div>
            )}
          </>
        )}

        {/* Empty state */}
        {page.tasks.length === 0 && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 160, color: "#C8C3BA", fontSize: "14px" }}>
            No tasks yet — add one below
          </div>
        )}

        {/* Completed section */}
        {doneTasks.length > 0 && (
          <>
            <div style={{ ...SECTION_LABEL_STYLE, marginTop: 8 }}>Completed</div>
            <div style={SECTION_DIVIDER_STYLE} />
            <AnimatePresence>
              {doneTasks.map((task) => (
                <TaskItem key={task.id} task={task} {...taskItemProps(task.id)} />
              ))}
            </AnimatePresence>
          </>
        )}
      </div>

      <TaskInput onAdd={(text) => addTask(page.id, text)} />
    </div>
  );
}
