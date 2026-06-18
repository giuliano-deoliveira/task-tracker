"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { BookOpen, CheckSquare, X } from "lucide-react";
import { usePlannerStore } from "@/store/plannerStore";
import { useUIStore } from "@/store/uiStore";
import type { Page } from "@/types";

interface Props {
  dateKey: string;
}

function TabItem({ page, isActive, onSelect, onDelete }: {
  page: Page;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: page.id });
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        position: "relative",
        flexShrink: 0,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        onClick={onSelect}
        {...attributes}
        {...listeners}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "8px 14px",
          paddingRight: hovered ? "28px" : "14px",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "13px",
          fontWeight: isActive ? 600 : 400,
          color: isActive ? "#3D5A80" : "#6B7280",
          borderRadius: "8px 8px 0 0",
          transition: "color 0.15s, padding 0.15s",
          position: "relative",
          whiteSpace: "nowrap",
          maxWidth: 160,
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {page.type === "cornell" ? <BookOpen size={13} /> : <CheckSquare size={13} />}
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", maxWidth: 100 }}>{page.title}</span>
      </button>

      {/* Active indicator */}
      {isActive && (
        <motion.div
          layoutId="tab-indicator"
          style={{
            position: "absolute",
            bottom: 0,
            left: 4,
            right: 4,
            height: 2,
            background: "#3D5A80",
            borderRadius: "2px 2px 0 0",
          }}
          transition={{ type: "spring", stiffness: 400, damping: 35 }}
        />
      )}

      {/* Delete button */}
      <AnimatePresence>
        {hovered && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            style={{
              position: "absolute",
              right: 6,
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              padding: 2,
              cursor: "pointer",
              color: "#9CA3AF",
              display: "flex",
              borderRadius: 4,
            }}
          >
            <X size={11} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

export function PageTabs({ dateKey }: Props) {
  const pages = usePlannerStore((s) => s.pages);
  const pageIdsByDate = usePlannerStore((s) => s.pageIdsByDate);
  const reorderPages = usePlannerStore((s) => s.reorderPages);
  const deletePage = usePlannerStore((s) => s.deletePage);
  const activePageId = useUIStore((s) => s.activePageId);
  const setActivePageId = useUIStore((s) => s.setActivePageId);

  const pageIds = pageIdsByDate[dateKey] || [];
  const sortedPages = pageIds
    .map((id) => pages[id])
    .filter(Boolean)
    .sort((a, b) => a.order - b.order);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = sortedPages.findIndex((p) => p.id === active.id);
    const newIndex = sortedPages.findIndex((p) => p.id === over.id);
    const newOrder = arrayMove(sortedPages, oldIndex, newIndex).map((p) => p.id);
    reorderPages(dateKey, newOrder);
  };

  const handleDelete = (pageId: string) => {
    deletePage(pageId);
    if (activePageId === pageId) {
      const remaining = sortedPages.filter((p) => p.id !== pageId);
      setActivePageId(remaining[0]?.id || null);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        borderBottom: "1px solid #E2DFD8",
        overflowX: "auto",
        gap: 2,
      }}
    >
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sortedPages.map((p) => p.id)} strategy={horizontalListSortingStrategy}>
          {sortedPages.map((page) => (
            <TabItem
              key={page.id}
              page={page}
              isActive={page.id === activePageId}
              onSelect={() => setActivePageId(page.id)}
              onDelete={() => handleDelete(page.id)}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
