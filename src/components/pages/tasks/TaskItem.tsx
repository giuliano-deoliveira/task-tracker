"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus } from "lucide-react";
import type { Task, SubTask } from "@/types";
import { formatShort } from "@/lib/dateUtils";

interface Props {
  task: Task;
  onToggle: () => void;
  onUpdateText: (text: string) => void;
  onDelete: () => void;
  onAddSubtask: (text: string) => void;
  onToggleSubtask: (subtaskId: string) => void;
  onUpdateSubtaskText: (subtaskId: string, text: string) => void;
  onDeleteSubtask: (subtaskId: string) => void;
}

function SubTaskRow({ subtask, onToggle, onUpdateText, onDelete }: {
  subtask: SubTask;
  onToggle: () => void;
  onUpdateText: (text: string) => void;
  onDelete: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(subtask.text);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0 4px 28px" }}
    >
      {/* Small checkbox */}
      <button
        onClick={onToggle}
        style={{
          width: 14,
          height: 14,
          borderRadius: 3,
          border: `1.5px solid ${subtask.done ? "#4A9B6F" : "#C8C3BA"}`,
          background: subtask.done ? "#4A9B6F" : "transparent",
          cursor: "pointer",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.15s",
          padding: 0,
        }}
      >
        {subtask.done && (
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <path d="M1.5 4l2 2L6.5 1.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {/* Text */}
      <div style={{ flex: 1 }}>
        {editing ? (
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={() => { setEditing(false); if (value.trim()) onUpdateText(value.trim()); }}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === "Escape") { setEditing(false); if (value.trim()) onUpdateText(value.trim()); } }}
            autoFocus
            style={{ border: "none", outline: "none", background: "transparent", fontSize: "13px", width: "100%", color: "#1A1A1A" }}
          />
        ) : (
          <span
            onClick={() => { if (!subtask.done) { setEditing(true); setValue(subtask.text); } }}
            style={{ fontSize: "13px", color: subtask.done ? "#9CA3AF" : "#6B7280", textDecoration: subtask.done ? "line-through" : "none", cursor: subtask.done ? "default" : "text" }}
          >
            {subtask.text}
          </span>
        )}
      </div>

      {hovered && (
        <button
          onClick={onDelete}
          style={{ background: "none", border: "none", padding: 2, cursor: "pointer", color: "#C8C3BA", display: "flex", borderRadius: 3, flexShrink: 0 }}
        >
          <Trash2 size={11} />
        </button>
      )}
    </div>
  );
}

export function TaskItem({ task, onToggle, onUpdateText, onDelete, onAddSubtask, onToggleSubtask, onUpdateSubtaskText, onDeleteSubtask }: Props) {
  const [hovered, setHovered] = useState(false);
  const [editingText, setEditingText] = useState(false);
  const [textValue, setTextValue] = useState(task.text);
  const [addingSubtask, setAddingSubtask] = useState(false);
  const [subtaskInput, setSubtaskInput] = useState("");

  const isDone = task.status === "done";
  const subtasks = task.subtasks ?? [];

  const handleAddSubtask = () => {
    if (subtaskInput.trim()) {
      onAddSubtask(subtaskInput.trim());
      setSubtaskInput("");
    }
    setAddingSubtask(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderBottom: "1px solid #F0EDE8",
        transition: "opacity 0.25s",
      }}
    >
      {/* Main task row */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 10,
          padding: "10px 16px 6px",
          opacity: isDone ? 0.55 : 1,
          minHeight: 44,
        }}
      >
        {/* Checkbox */}
        <button
          onClick={onToggle}
          style={{
            width: 18,
            height: 18,
            borderRadius: 4,
            border: `2px solid ${isDone ? "#4A9B6F" : "#C8C3BA"}`,
            background: isDone ? "#4A9B6F" : "transparent",
            cursor: "pointer",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s",
            padding: 0,
            marginTop: 1,
          }}
        >
          {isDone && (
            <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 5l2.5 2.5L8 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </motion.svg>
          )}
        </button>

        {/* Text + rolled-from badge */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {editingText ? (
            <input
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              onBlur={() => { setEditingText(false); if (textValue.trim()) onUpdateText(textValue.trim()); }}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === "Escape") { setEditingText(false); if (textValue.trim()) onUpdateText(textValue.trim()); } }}
              autoFocus
              style={{ border: "none", outline: "none", background: "transparent", fontSize: "14px", fontFamily: "Inter, sans-serif", width: "100%", color: "#1A1A1A" }}
            />
          ) : (
            <span
              onClick={() => { if (!isDone) { setEditingText(true); setTextValue(task.text); } }}
              style={{
                fontSize: "14px",
                textDecoration: isDone ? "line-through" : "none",
                color: isDone ? "#9CA3AF" : "#1A1A1A",
                cursor: isDone ? "default" : "text",
                transition: "text-decoration 0.25s, color 0.25s",
                display: "block",
              }}
            >
              {task.text}
            </span>
          )}
          {task.rolledFromDate && (
            <span style={{ fontSize: "11px", color: "#B45309", fontWeight: 500, display: "block", marginTop: 2 }}>
              ↑ from {formatShort(task.rolledFromDate)}
            </span>
          )}
        </div>

        {/* Hover actions */}
        {hovered && !isDone && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", gap: 2, flexShrink: 0 }}>
            <button
              onClick={() => setAddingSubtask(true)}
              title="Add subtask"
              style={{ padding: "3px 6px", background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", display: "flex", alignItems: "center", gap: 3, borderRadius: 4, fontSize: "11px" }}
            >
              <Plus size={12} /> subtask
            </button>
            <button
              onClick={onDelete}
              title="Delete task"
              style={{ padding: 4, background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", display: "flex", borderRadius: 4 }}
            >
              <Trash2 size={14} />
            </button>
          </motion.div>
        )}
      </div>

      {/* Subtasks */}
      {subtasks.length > 0 && (
        <div style={{ paddingBottom: 4 }}>
          <AnimatePresence>
            {subtasks.map((st) => (
              <SubTaskRow
                key={st.id}
                subtask={st}
                onToggle={() => onToggleSubtask(st.id)}
                onUpdateText={(text) => onUpdateSubtaskText(st.id, text)}
                onDelete={() => onDeleteSubtask(st.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add subtask input */}
      {addingSubtask && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 16px 8px 28px" }}>
          <div style={{ width: 14, height: 14, borderRadius: 3, border: "1.5px solid #E2DFD8", flexShrink: 0 }} />
          <input
            value={subtaskInput}
            onChange={(e) => setSubtaskInput(e.target.value)}
            onBlur={handleAddSubtask}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddSubtask();
              if (e.key === "Escape") { setAddingSubtask(false); setSubtaskInput(""); }
            }}
            autoFocus
            placeholder="Subtask…"
            style={{ flex: 1, border: "none", borderBottom: "1px solid #E2DFD8", outline: "none", background: "transparent", fontSize: "13px", color: "#1A1A1A", padding: "2px 0" }}
          />
        </div>
      )}
    </motion.div>
  );
}
