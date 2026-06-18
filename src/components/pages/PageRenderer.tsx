"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useUIStore } from "@/store/uiStore";
import { usePlannerStore } from "@/store/plannerStore";
import { CornellPage } from "./cornell/CornellPage";
import { TaskPage } from "./tasks/TaskPage";

export function PageRenderer() {
  const activePageId = useUIStore((s) => s.activePageId);
  const pages = usePlannerStore((s) => s.pages);

  const page = activePageId ? pages[activePageId] : null;

  return (
    <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <AnimatePresence mode="wait">
        {page ? (
          <motion.div
            key={page.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}
          >
            {page.type === "cornell" ? (
              <CornellPage page={page} />
            ) : (
              <TaskPage page={page} />
            )}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#9CA3AF" }}
          >
            Select a page
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
