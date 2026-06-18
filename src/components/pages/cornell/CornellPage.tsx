"use client";
import { useCallback, useRef } from "react";
import type { JSONContent } from "@tiptap/core";
import type { CornellPage as CornellPageType } from "@/types";
import { usePlannerStore } from "@/store/plannerStore";
import { CueColumn } from "./CueColumn";
import { NotesArea } from "./NotesArea";
import { SummarySection } from "./SummarySection";
import { EditableTitle } from "../EditableTitle";

interface Props {
  page: CornellPageType;
}

export function CornellPage({ page }: Props) {
  const updateCornellField = usePlannerStore((s) => s.updateCornellField);
  const updatePageTitle = usePlannerStore((s) => s.updatePageTitle);

  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const debounced = useCallback(
    (field: "cue" | "notes" | "summary", content: JSONContent) => {
      clearTimeout(timers.current[field]);
      timers.current[field] = setTimeout(() => {
        updateCornellField(page.id, field, content);
      }, 500);
    },
    [page.id, updateCornellField]
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
        padding: "20px 32px 0",
      }}
    >
      <EditableTitle title={page.title} onSave={(t) => updatePageTitle(page.id, t)} />

      {/* Column labels */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "30% 70%",
          borderBottom: "1px solid #C8C3BA",
          paddingBottom: 4,
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: "10px", fontWeight: 600, color: "#9CA3AF", letterSpacing: "0.08em", textTransform: "uppercase", paddingLeft: 2 }}>
          Cue / Keywords
        </span>
        <span style={{ fontSize: "10px", fontWeight: 600, color: "#9CA3AF", letterSpacing: "0.08em", textTransform: "uppercase", paddingLeft: 16 }}>
          Notes
        </span>
      </div>

      {/* Cornell grid */}
      <div style={{ display: "grid", gridTemplateColumns: "30% 70%", flex: 1, overflow: "hidden", minHeight: 0 }}>
        <CueColumn content={page.cue} onChange={(c) => debounced("cue", c)} />
        <NotesArea content={page.notes} onChange={(c) => debounced("notes", c)} />
      </div>

      {/* Summary */}
      <div style={{ borderTop: "2px solid #C8C3BA", flexShrink: 0 }}>
        <span style={{ fontSize: "10px", fontWeight: 600, color: "#9CA3AF", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", padding: "6px 2px 4px" }}>
          Summary
        </span>
      </div>
      <div style={{ flexShrink: 0, minHeight: 100, maxHeight: 200, overflowY: "auto", paddingBottom: 16 }}>
        <SummarySection content={page.summary} onChange={(c) => debounced("summary", c)} />
      </div>
    </div>
  );
}
