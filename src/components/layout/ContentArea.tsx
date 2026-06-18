"use client";
import { AnimatePresence, motion } from "framer-motion";
import { PageTabs } from "@/components/pages/PageTabs";
import { PageRenderer } from "@/components/pages/PageRenderer";
import { usePlannerStore } from "@/store/plannerStore";
import { useUIStore } from "@/store/uiStore";
import { formatDisplay } from "@/lib/dateUtils";
import { BookOpen, CheckSquare, Plus } from "lucide-react";
import { useState, useRef } from "react";

interface Props {
  dateKey: string;
}

export function ContentArea({ dateKey }: Props) {
  const pageIdsByDate = usePlannerStore((s) => s.pageIdsByDate);
  const addPage = usePlannerStore((s) => s.addPage);
  const setActivePageId = useUIStore((s) => s.setActivePageId);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const pageIds = pageIdsByDate[dateKey] || [];

  const handleAddPage = (type: "cornell" | "task") => {
    const id = addPage(dateKey, type);
    setActivePageId(id);
    setShowAddMenu(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {/* Header */}
      <div
        style={{
          padding: "20px 32px 0",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h2
            className="font-serif"
            style={{ fontSize: "22px", fontWeight: 600, color: "#1A1A1A", margin: 0 }}
          >
            {formatDisplay(dateKey)}
          </h2>
          {/* Add page button */}
          <div style={{ position: "relative" }} ref={menuRef}>
            <button
              onClick={() => setShowAddMenu(!showAddMenu)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                borderRadius: 8,
                background: "#3D5A80",
                color: "white",
                border: "none",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 500,
                boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
              }}
            >
              <Plus size={14} />
              New Page
            </button>
            <AnimatePresence>
              {showAddMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.97 }}
                  transition={{ duration: 0.12 }}
                  style={{
                    position: "absolute",
                    top: "calc(100% + 6px)",
                    right: 0,
                    background: "white",
                    border: "1px solid #E2DFD8",
                    borderRadius: 10,
                    boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                    zIndex: 100,
                    minWidth: 180,
                    overflow: "hidden",
                  }}
                >
                  <button
                    onClick={() => handleAddPage("cornell")}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "12px 16px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                      fontSize: "13px",
                      color: "#1A1A1A",
                      transition: "background 0.1s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#F7F6F3")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                  >
                    <BookOpen size={15} color="#3D5A80" />
                    <div>
                      <div style={{ fontWeight: 500 }}>Cornell Notes</div>
                      <div style={{ fontSize: "11px", color: "#9CA3AF", marginTop: 1 }}>Cue · Notes · Summary</div>
                    </div>
                  </button>
                  <div style={{ height: 1, background: "#E2DFD8", margin: "0 12px" }} />
                  <button
                    onClick={() => handleAddPage("task")}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "12px 16px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                      fontSize: "13px",
                      color: "#1A1A1A",
                      transition: "background 0.1s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#F7F6F3")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                  >
                    <CheckSquare size={15} color="#3D5A80" />
                    <div>
                      <div style={{ fontWeight: 500 }}>Task List</div>
                      <div style={{ fontSize: "11px", color: "#9CA3AF", marginTop: 1 }}>Checkboxes · Rollover</div>
                    </div>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        {pageIds.length > 0 && <PageTabs dateKey={dateKey} />}
      </div>

      {/* Page content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={dateKey}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}
        >
          {pageIds.length === 0 ? (
            <EmptyState dateKey={dateKey} />
          ) : (
            <PageRenderer />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function EmptyState({ dateKey }: { dateKey: string }) {
  const addPage = usePlannerStore((s) => s.addPage);
  const setActivePageId = useUIStore((s) => s.setActivePageId);

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        color: "#9CA3AF",
        padding: 40,
      }}
    >
      <div style={{ fontSize: 48 }}>📄</div>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: "16px", fontWeight: 500, color: "#6B7280", margin: "0 0 6px" }}>
          No pages for this day
        </p>
        <p style={{ fontSize: "13px", margin: 0 }}>Create a Cornell note or task list to get started</p>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={() => { const id = addPage(dateKey, "cornell"); setActivePageId(id); }}
          style={{
            padding: "10px 18px",
            borderRadius: 8,
            background: "#3D5A80",
            color: "white",
            border: "none",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <BookOpen size={14} /> Cornell Notes
        </button>
        <button
          onClick={() => { const id = addPage(dateKey, "task"); setActivePageId(id); }}
          style={{
            padding: "10px 18px",
            borderRadius: 8,
            background: "white",
            color: "#3D5A80",
            border: "1px solid #3D5A80",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <CheckSquare size={14} /> Task List
        </button>
      </div>
    </div>
  );
}
