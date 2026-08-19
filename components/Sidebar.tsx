"use client";

import { Button } from "@/components/ui/Button";

export interface SidebarProps {
  counts: { total: number; active: number; completed: number };
  onAddClick: () => void;
}

const STATS: { key: keyof SidebarProps["counts"]; label: string }[] = [
  { key: "total", label: "Total tasks" },
  { key: "active", label: "Active" },
  { key: "completed", label: "Completed" },
];

export function Sidebar({ counts, onAddClick }: SidebarProps) {
  return (
    <div
      style={{
        width: 260,
        flexShrink: 0,
        background: "var(--sidebar-bg)",
        color: "var(--sidebar-text)",
        padding: "28px 22px",
        display: "flex",
        flexDirection: "column",
        gap: 32,
        minHeight: "100vh",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 9,
            background: "var(--primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            color: "#fff",
            fontSize: 16,
          }}
        >
          t
        </div>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 19, letterSpacing: "-0.02em" }}>
          taskr
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {STATS.map((stat) => (
          <div
            key={stat.key}
            style={{
              background: "var(--sidebar-card-bg)",
              borderRadius: "var(--radius-lg)",
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontSize: 13, color: "var(--sidebar-subtext)" }}>{stat.label}</span>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16 }}>
              {counts[stat.key]}
            </span>
          </div>
        ))}
      </div>

      <Button
        onClick={onAddClick}
        style={{ marginTop: "auto", width: "100%" }}
      >
        <span style={{ fontSize: 17, lineHeight: 0 }}>+</span> New Task
      </Button>
    </div>
  );
}
