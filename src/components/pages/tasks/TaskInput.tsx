"use client";
import { useState } from "react";
import { Plus } from "lucide-react";

interface Props {
  onAdd: (text: string) => void;
}

export function TaskInput({ onAdd }: Props) {
  const [value, setValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && value.trim()) {
      onAdd(value.trim());
      setValue("");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 16px",
        borderTop: "1px solid #E2DFD8",
        backgroundColor: "#F7F6F3",
        flexShrink: 0,
      }}
    >
      <Plus size={14} color="#9CA3AF" />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add a task… (press Enter)"
        style={{
          flex: 1,
          background: "none",
          border: "none",
          outline: "none",
          fontSize: "14px",
          color: "#1A1A1A",
          fontFamily: "Inter, sans-serif",
        }}
      />
    </div>
  );
}
