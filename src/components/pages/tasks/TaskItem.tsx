"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRightCircle, Trash2, XCircle } from "lucide-react";
import type { Task } from "@/types";
import { formatShort, nextDayKey } from "@/lib/dateUtils";
import { useUIStore } from "@/store/uiStore";

interface Props {
  task: Task;
  onToggle: () => void;
  onUpdateText: (text: string) => void;
  onSetRollover: (nextDate: string) => void;
  onRemoveRollover: () => void;
  onDelete: () => void;
}

export function TaskItem({ task, onToggle, onUpdateText, onSetRollover, onRemoveRollover, onDelete }: Props) {
  const [hovered, setHovered] = useState(false);
  const [editingText, setEditingText] = useState(false);
  const [textValue, setTextValue] = useState(task.text);
  const selectedDate = useUIStore((s) => s.selectedDate);

  const isDone = task.status === "done";
  const isRolled = task.status === "rolled";

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
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 16px",
        borderBottom: "1px solid #F0EDE8",
        opacity: isDone ? 0.6 : 1,
        transition: "opacity 0.25s",
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
        }}
      >
        {isDone && (
          <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 5l2.5 2.5L8 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
        )}
      </button>

      {/* Text + badges */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        {editingText ? (
          <input
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            onBlur={() => { setEditingText(false); onUpdateText(textValue); }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === "Escape") { setEditingText(false); onUpdateText(textValue); }
            }}
            autoFocus
            style={{ border: "none", outline: "none", background: "transparent", fontSize: "14px", fontFamily: "Inter, sans-serif", width: "100%" }}
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
            }}
          >
            {task.text}
          </span>
        )}
        {task.rolledFromDate && (
          <span style={{ fontSize: "11px", color: "#B45309", fontWeight: 500 }}>
            ↑ from {formatShort(task.rolledFromDate)}
          </span>
        )}
        {isRolled && task.rolledToDate && (
          <span style={{ fontSize: "11px", color: "#B45309", fontWeight: 500 }}>
            → rolling to {formatShort(task.rolledToDate)}
          </span>
        )}
      </div>

      {/* Hover actions */}
      {hovered && !isDone && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", gap: 4 }}>
          {isRolled ? (
            <button
              onClick={onRemoveRollover}
              title="Cancel rollover"
              style={{ padding: 4, background: "none", border: "none", cursor: "pointer", color: "#B45309", display: "flex", borderRadius: 4 }}
            >
              <XCircle size={15} />
            </button>
          ) : (
            <button
              onClick={() => onSetRollover(nextDayKey(selectedDate))}
              title="Roll to next day"
              style={{ padding: 4, background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", display: "flex", borderRadius: 4 }}
            >
              <ArrowRightCircle size={15} />
            </button>
          )}
          <button
            onClick={onDelete}
            title="Delete task"
            style={{ padding: 4, background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", display: "flex", borderRadius: 4 }}
          >
            <Trash2 size={15} />
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
