"use client";
import * as Dialog from "@radix-ui/react-dialog";

interface Props {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ open, title, description, confirmLabel = "Delete", onConfirm, onCancel }: Props) {
  return (
    <Dialog.Root open={open} onOpenChange={(v) => { if (!v) onCancel(); }}>
      <Dialog.Portal>
        <Dialog.Overlay
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.3)",
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
            borderRadius: 12,
            padding: "24px 28px",
            zIndex: 201,
            width: 380,
            maxWidth: "90vw",
            boxShadow: "0 16px 48px rgba(0,0,0,0.15)",
          }}
        >
          <Dialog.Title
            style={{ fontSize: "16px", fontWeight: 600, color: "#1A1A1A", marginBottom: 8, fontFamily: "Lora, serif" }}
          >
            {title}
          </Dialog.Title>
          <Dialog.Description
            style={{ fontSize: "13px", color: "#6B7280", lineHeight: 1.6, marginBottom: 24 }}
          >
            {description}
          </Dialog.Description>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button
              onClick={onCancel}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                border: "1px solid #E2DFD8",
                background: "white",
                color: "#6B7280",
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                border: "none",
                background: "#DC2626",
                color: "white",
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              {confirmLabel}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
