"use client";
import { useState, useRef } from "react";

interface Props {
  title: string;
  onSave: (title: string) => void;
}

export function EditableTitle({ title, onSave }: Props) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    setEditing(true);
    setValue(title);
    setTimeout(() => inputRef.current?.select(), 0);
  };

  const handleBlur = () => {
    setEditing(false);
    if (value.trim()) onSave(value.trim());
    else setValue(title);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === "Escape") inputRef.current?.blur();
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        autoFocus
        style={{
          fontSize: "18px",
          fontWeight: 600,
          fontFamily: "Lora, serif",
          color: "#1A1A1A",
          border: "none",
          outline: "none",
          background: "transparent",
          borderBottom: "2px solid #3D5A80",
          padding: "2px 0",
          marginBottom: 12,
          width: "100%",
        }}
      />
    );
  }

  return (
    <h3
      onClick={handleClick}
      title="Click to edit title"
      style={{
        fontSize: "18px",
        fontWeight: 600,
        fontFamily: "Lora, serif",
        color: "#1A1A1A",
        margin: "0 0 12px",
        cursor: "text",
        padding: "2px 0",
        borderBottom: "2px solid transparent",
        transition: "border-color 0.15s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderBottomColor = "#E2DFD8")}
      onMouseLeave={(e) => (e.currentTarget.style.borderBottomColor = "transparent")}
    >
      {title}
    </h3>
  );
}
