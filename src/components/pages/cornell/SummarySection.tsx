"use client";
import type { JSONContent } from "@tiptap/core";
import { RichTextEditor } from "@/components/editor/RichTextEditor";

interface Props {
  content: JSONContent;
  onChange: (content: JSONContent) => void;
}

export function SummarySection({ content, onChange }: Props) {
  return (
    <div style={{ fontSize: "14px", lineHeight: 1.7, padding: "2px 0" }}>
      <RichTextEditor content={content} onChange={onChange} placeholder="Summarise the key takeaways…" minHeight={80} />
    </div>
  );
}
