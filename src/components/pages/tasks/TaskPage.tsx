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

export function TaskPage({ page }: Props) {
  const addTask = usePlannerStore((s) => s.addTask);
  const toggleTaskStatus = usePlannerStore((s) => s.toggleTaskStatus);
  const updateTaskText = usePlannerStore((s) => s.updateTaskText);
  const setTaskRollover = usePlannerStore((s) => s.setTaskRollover);
  const removeRollover = usePlannerStore((s) => s.removeRollover);
  const deleteTask = usePlannerStore((s) => s.deleteTask);
  const updatePageTitle = usePlannerStore((s) => s.updatePageTitle);

  const todoTasks = page.tasks.filter((t) => t.status !== "done");
  const doneTasks = page.tasks.filter((t) => t.status === "done");

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <div style={{ padding: "20px 32px 0", flexShrink: 0 }}>
        <EditableTitle title={page.title} onSave={(t) => updatePageTitle(page.id, t)} />
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        <AnimatePresence>
          {todoTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={() => toggleTaskStatus(page.id, task.id)}
              onUpdateText={(text) => updateTaskText(page.id, task.id, text)}
              onSetRollover={(nextDate) => setTaskRollover(page.id, task.id, nextDate)}
              onRemoveRollover={() => removeRollover(page.id, task.id)}
              onDelete={() => deleteTask(page.id, task.id)}
            />
          ))}
        </AnimatePresence>

        {doneTasks.length > 0 && (
          <>
            <div
              style={{
                padding: "8px 16px 4px",
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#9CA3AF",
                borderTop: "1px solid #E2DFD8",
                marginTop: 8,
              }}
            >
              Completed
            </div>
            <AnimatePresence>
              {doneTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={() => toggleTaskStatus(page.id, task.id)}
                  onUpdateText={(text) => updateTaskText(page.id, task.id, text)}
                  onSetRollover={(nextDate) => setTaskRollover(page.id, task.id, nextDate)}
                  onRemoveRollover={() => removeRollover(page.id, task.id)}
                  onDelete={() => deleteTask(page.id, task.id)}
                />
              ))}
            </AnimatePresence>
          </>
        )}

        {page.tasks.length === 0 && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200, color: "#C8C3BA", fontSize: "14px" }}>
            No tasks yet — add one below
          </div>
        )}
      </div>

      <TaskInput onAdd={(text) => addTask(page.id, text)} />
    </div>
  );
}
