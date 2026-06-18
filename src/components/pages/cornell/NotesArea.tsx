"use client";
import type { JSONContent } from "@tiptap/core";
import { RichTextEditor } from "@/components/editor/RichTextEditor";

interface Props {
  content: JSONContent;
  onChange: (content: JSONContent) => void;
}

export function NotesArea({ content, onChange }: Props) {
  return (
    <div
      style={{
        padding: "12px 2px 12px 16px",
        overflowY: "auto",
        height: "100%",
        fontSize: "15px",
        lineHeight: 1.7,
      }}
    >
      <RichTextEditor content={content} onChange={onChange} placeholder="Start taking notes…" minHeight={300} />
    </div>
  );
}
