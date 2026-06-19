"use client";
import { MiniCalendar } from "@/components/calendar/MiniCalendar";
import { useUIStore } from "@/store/uiStore";
import { motion } from "framer-motion";
import { PanelLeftClose } from "lucide-react";

const isMac = typeof navigator !== "undefined" && navigator.platform.includes("Mac");
const mod = isMac ? "⌘" : "Ctrl";

export function Sidebar() {
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  return (
    <motion.div
      animate={{ width: sidebarCollapsed ? 0 : 260 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      style={{ overflow: "hidden", flexShrink: 0 }}
    >
      <div
        style={{
          width: 260,
          height: "100vh",
          backgroundColor: "#EFEDE8",
          borderRight: "1px solid #E2DFD8",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div style={{ padding: "18px 20px 14px", borderBottom: "1px solid #E2DFD8", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 className="font-serif" style={{ fontSize: "17px", fontWeight: 600, color: "#1A1A1A", margin: 0 }}>
              Daily Planner
            </h1>
            <p style={{ fontSize: "11px", color: "#9CA3AF", marginTop: 2, marginBottom: 0 }}>
              Cornell notes &amp; tasks
            </p>
          </div>
          <button
            onClick={toggleSidebar}
            title="Collapse sidebar"
            style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", padding: 4, display: "flex", borderRadius: 6, flexShrink: 0 }}
          >
            <PanelLeftClose size={16} />
          </button>
        </div>

        {/* Calendar */}
        <div style={{ padding: "16px 12px", flex: 1, overflowY: "auto" }}>
          <MiniCalendar />
        </div>

        {/* Footer: legend + shortcuts */}
        <div style={{ padding: "14px 16px", borderTop: "1px solid #E2DFD8" }}>
          {/* Calendar legend */}
          <div style={{ display: "flex", gap: 14, marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "11px", color: "#9CA3AF" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#3D5A80", display: "inline-block", flexShrink: 0 }} />
              has pages
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "11px", color: "#9CA3AF" }}>
              <span style={{ width: 13, height: 13, borderRadius: "50%", border: "2px solid #3D5A80", display: "inline-block", flexShrink: 0 }} />
              today
            </div>
          </div>

          {/* Shortcuts */}
          <div style={{ borderTop: "1px solid #E2DFD8", paddingTop: 10 }}>
            <p style={{ fontSize: "10px", fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 8px" }}>
              Shortcuts
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {[
                { key: "[ ]", label: "Prev / next day" },
                { key: `${mod}N`, label: "New Cornell note" },
                { key: `${mod}T`, label: "New task list" },
                { key: "?", label: "All shortcuts" },
              ].map(({ key, label }) => (
                <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "11px", color: "#9CA3AF" }}>{label}</span>
                  <kbd style={{ fontSize: "10px", fontFamily: "JetBrains Mono, monospace", background: "#E2DFD8", color: "#6B7280", padding: "2px 6px", borderRadius: 4, border: "1px solid #C8C3BA" }}>
                    {key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
