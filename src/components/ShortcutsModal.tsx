"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useUIStore } from "@/store/uiStore";

const isMac = typeof navigator !== "undefined" && navigator.platform.includes("Mac");
const mod = isMac ? "⌘" : "Ctrl";

const SHORTCUTS = [
  { key: `${mod} N`, action: "New Cornell note" },
  { key: `${mod} T`, action: "New task list" },
  { key: "[", action: "Go to previous day" },
  { key: "]", action: "Go to next day" },
  { key: "?", action: "Show keyboard shortcuts" },
  { key: `${mod} B`, action: "Bold (in editor)" },
  { key: `${mod} I`, action: "Italic (in editor)" },
  { key: "Escape", action: "Close dialog / blur editor" },
];

export function ShortcutsModal() {
  const shortcutsOpen = useUIStore((s) => s.shortcutsOpen);
  const setShortcutsOpen = useUIStore((s) => s.setShortcutsOpen);

  return (
    <Dialog.Root open={shortcutsOpen} onOpenChange={setShortcutsOpen}>
      <Dialog.Portal>
        <Dialog.Overlay
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.25)",
            zIndex: 200,
            backdropFilter: "blur(2px)",
          }}
        />
        <Dialog.Content
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "white",
            borderRadius: 14,
            padding: "28px 32px",
            zIndex: 201,
            width: 400,
            maxWidth: "90vw",
            boxShadow: "0 16px 48px rgba(0,0,0,0.15)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <Dialog.Title
              style={{ fontSize: "16px", fontWeight: 600, color: "#1A1A1A", fontFamily: "Lora, serif", margin: 0 }}
            >
              Keyboard Shortcuts
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", padding: 4, display: "flex", borderRadius: 6 }}
              >
                <X size={16} />
              </button>
            </Dialog.Close>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {SHORTCUTS.map(({ key, action }) => (
              <div
                key={key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 0",
                  borderBottom: "1px solid #F7F6F3",
                }}
              >
                <span style={{ fontSize: "13px", color: "#6B7280" }}>{action}</span>
                <kbd
                  style={{
                    fontSize: "11px",
                    fontFamily: "JetBrains Mono, monospace",
                    background: "#F0EDE8",
                    color: "#1A1A1A",
                    padding: "3px 8px",
                    borderRadius: 5,
                    border: "1px solid #E2DFD8",
                    letterSpacing: "0.02em",
                  }}
                >
                  {key}
                </kbd>
              </div>
            ))}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
