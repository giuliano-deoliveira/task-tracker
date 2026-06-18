"use client";
import { MiniCalendar } from "@/components/calendar/MiniCalendar";

export function Sidebar() {
  return (
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
      {/* Logo / App Name */}
      <div
        style={{
          padding: "20px 20px 16px",
          borderBottom: "1px solid #E2DFD8",
        }}
      >
        <h1
          className="font-serif"
          style={{ fontSize: "18px", fontWeight: 600, color: "#1A1A1A", margin: 0 }}
        >
          Daily Planner
        </h1>
        <p style={{ fontSize: "11px", color: "#9CA3AF", marginTop: 2, marginBottom: 0 }}>
          Cornell notes &amp; tasks
        </p>
      </div>

      {/* Calendar */}
      <div style={{ padding: "16px 12px", flex: 1, overflowY: "auto" }}>
        <MiniCalendar />
      </div>

      {/* Legend */}
      <div
        style={{
          padding: "12px 16px",
          borderTop: "1px solid #E2DFD8",
          fontSize: "11px",
          color: "#9CA3AF",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#3D5A80", display: "inline-block" }} />
          has pages
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid #3D5A80", display: "inline-block" }} />
          today
        </div>
        <div style={{ marginTop: 4, fontSize: "10px" }}>
          Press [ ] to navigate days
        </div>
      </div>
    </div>
  );
}
