"use client";

import { Button } from "@/components/ui/Button";

export interface SidebarProps {
  counts: { total: number; active: number; completed: number };
  onAddClick: () => void;
}

const STATS: { key: keyof SidebarProps["counts"]; label: string }[] = [
  { key: "total", label: "All Tasks" },
  { key: "active", label: "Incomplete" },
  { key: "completed", label: "Completed" },
];

export function Sidebar({ counts, onAddClick }: SidebarProps) {
  return (
    <div
      className="sidebar"
      style={{
        background: "var(--sidebar-bg)",
        color: "var(--sidebar-text)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {/* <div
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
          T
        </div> */}
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 19, letterSpacing: "-0.02em" }}>
          Taskr
        </div>
      </div>

      <div className="sidebar-stats">
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
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, paddingLeft: 6 }}>
              {counts[stat.key]}
            </span>
          </div>
        ))}
      </div>

      {/* <div className="sidebar-cta">
        <Button onClick={onAddClick} style={{ width: "100%" }}>
          <span style={{ fontSize: 17, lineHeight: 0 }}>+</span> New Task
        </Button>
      </div> */}

      <Button
        onClick={onAddClick}
        aria-label="New Task"
        className="fab"
        style={{ width: 56, height: 56, padding: 0, borderRadius: "var(--radius-full)" }}
      >
        <span style={{ fontSize: 26, lineHeight: 0, paddingBottom: 6, paddingLeft: 2 }}>+</span>
      </Button>
    </div>
  );
}
