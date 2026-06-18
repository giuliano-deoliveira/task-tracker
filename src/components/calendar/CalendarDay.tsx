"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { dateToKey } from "@/lib/dateUtils";

interface Props {
  date: Date;
  isToday: boolean;
  isSelected: boolean;
  isCurrentMonth: boolean;
  hasPages: boolean;
}

export function CalendarDay({ date, isToday, isSelected, isCurrentMonth, hasPages }: Props) {
  const router = useRouter();
  const dateKey = dateToKey(date);

  return (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => router.push(`/planner/${dateKey}`)}
      style={{
        position: "relative",
        width: 32,
        height: 32,
        borderRadius: "50%",
        border: isToday ? "2px solid #3D5A80" : "2px solid transparent",
        background: isSelected ? "#3D5A80" : "transparent",
        color: isSelected ? "white" : isCurrentMonth ? "#1A1A1A" : "#C8C3BA",
        fontWeight: isToday || isSelected ? 600 : 400,
        fontSize: "12px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        lineHeight: 1,
        padding: 0,
        transition: "background 0.15s, color 0.15s",
      }}
    >
      {date.getDate()}
      {hasPages && (
        <span
          style={{
            position: "absolute",
            bottom: 3,
            width: 4,
            height: 4,
            borderRadius: "50%",
            background: isSelected ? "rgba(255,255,255,0.7)" : "#3D5A80",
          }}
        />
      )}
    </motion.button>
  );
}
