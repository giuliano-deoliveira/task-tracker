"use client";
import type { JSONContent } from "@tiptap/core";
import { RichTextEditor } from "@/components/editor/RichTextEditor";

interface Props {
  content: JSONContent;
  onChange: (content: JSONContent) => void;
}

export function CueColumn({ content, onChange }: Props) {
  return (
    <div
      style={{
        backgroundColor: "#F0EDE8",
        borderRight: "1px solid #C8C3BA",
        padding: "12px 16px 12px 2px",
        overflowY: "auto",
        height: "100%",
        fontSize: "14px",
        lineHeight: 1.7,
      }}
    >
      <RichTextEditor content={content} onChange={onChange} placeholder="Keywords, questions, cues…" minHeight={200} />
    </div>
  );
}
