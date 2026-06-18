"use client";
import { useEditor, EditorContent, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import Link from "@tiptap/extension-link";
import type { JSONContent } from "@tiptap/core";
import { Bold, Italic, Code, List, Heading2 } from "lucide-react";

interface Props {
  content: JSONContent;
  onChange: (content: JSONContent) => void;
  placeholder?: string;
  minHeight?: number;
}

function ToolbarButton({
  onClick,
  active,
  children,
}: {
  onClick: () => void;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      style={{
        padding: "4px 8px",
        background: active ? "#3D5A80" : "white",
        color: active ? "white" : "#1A1A1A",
        border: "none",
        borderRadius: 4,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        fontSize: "12px",
      }}
    >
      {children}
    </button>
  );
}

export function RichTextEditor({ content, onChange, placeholder = "Start writing…", minHeight = 100 }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
      Typography,
      Link.configure({ openOnClick: false }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
    editorProps: {
      attributes: {
        style: `min-height: ${minHeight}px; padding: 0;`,
      },
    },
    immediatelyRender: false,
  });

  return (
    <div style={{ position: "relative" }}>
      {editor && (
        <div
          style={{
            display: "flex",
            gap: 2,
            marginBottom: 8,
            background: "white",
            border: "1px solid #E2DFD8",
            borderRadius: 8,
            padding: 4,
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            width: "fit-content",
          }}
        >
          <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}>
            <Bold size={13} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}>
            <Italic size={13} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive("code")}>
            <Code size={13} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })}>
            <Heading2 size={13} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")}>
            <List size={13} />
          </ToolbarButton>
        </div>
      )}
      <EditorContent editor={editor} />
    </div>
  );
}
