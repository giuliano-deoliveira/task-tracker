"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "./Sidebar";
import { ContentArea } from "./ContentArea";
import { useUIStore } from "@/store/uiStore";
import { usePlannerDate } from "@/hooks/usePlannerDate";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

interface Props {
  dateKey: string;
}

export function AppShell({ dateKey }: Props) {
  usePlannerDate(dateKey);
  useKeyboardShortcuts();

  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", backgroundColor: "#F7F6F3" }}>
      {/* Sidebar */}
      <motion.div
        animate={{ width: sidebarCollapsed ? 0 : 260 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        style={{ overflow: "hidden", flexShrink: 0 }}
      >
        <div style={{ width: 260 }}>
          <Sidebar />
        </div>
      </motion.div>

      {/* Toggle button */}
      <button
        onClick={toggleSidebar}
        title={sidebarCollapsed ? "Show sidebar" : "Hide sidebar"}
        style={{
          position: "fixed",
          top: 16,
          left: sidebarCollapsed ? 12 : 272,
          zIndex: 50,
          padding: "6px",
          borderRadius: "8px",
          background: "white",
          border: "1px solid #E2DFD8",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#6B7280",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          transition: "left 0.25s ease-in-out",
        }}
      >
        {sidebarCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
      </button>

      {/* Content */}
      <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <ContentArea dateKey={dateKey} />
      </div>
    </div>
  );
}
