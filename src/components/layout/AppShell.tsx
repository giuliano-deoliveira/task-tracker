"use client";
import { motion } from "framer-motion";
import { Sidebar } from "./Sidebar";
import { ContentArea } from "./ContentArea";
import { usePlannerDate } from "@/hooks/usePlannerDate";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { ShortcutsModal } from "@/components/ShortcutsModal";

interface Props {
  dateKey: string;
}

export function AppShell({ dateKey }: Props) {
  usePlannerDate(dateKey);
  useKeyboardShortcuts();

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", backgroundColor: "#F7F6F3" }}>
      <Sidebar />
      <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <ContentArea dateKey={dateKey} />
      </div>
      <ShortcutsModal />
    </div>
  );
}
