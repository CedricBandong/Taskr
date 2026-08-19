"use client";

import React from "react";
import { gsap } from "gsap";
import { Checkbox } from "@/components/ui/Checkbox";
import { Button } from "@/components/ui/Button";
import { formatShortDate } from "@/lib/format";
import { statusBadge } from "@/lib/task-ui";
import type { Task } from "@/lib/types";

export interface TaskDetailProps {
  task: Task;
  onBack: () => void;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskDetail({ task, onBack, onToggle, onEdit, onDelete }: TaskDetailProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const badge = statusBadge(task.completed);

  React.useEffect(() => {
    gsap.fromTo(
      rootRef.current,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.22, ease: "power2.out" }
    );
  }, []);

  const handleDelete = () => {
    if (!window.confirm("Delete this task?")) return;
    onDelete(task.id);
  };

  return (
    <div ref={rootRef}>
      <button
        onClick={onBack}
        style={{
          border: "none",
          background: "transparent",
          color: "var(--muted-foreground)",
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          fontSize: "13.5px",
          cursor: "pointer",
          padding: 0,
          marginBottom: 22,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        ← Back to tasks
      </button>

      <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius-xl)", padding: 32 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
            <Checkbox checked={task.completed} onCheckedChange={() => onToggle(task.id)} size={26} style={{ marginTop: 4 }} />
            <div>
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: 24,
                  margin: "0 0 8px 0",
                  color: task.completed ? "var(--faint-foreground)" : "var(--foreground)",
                  textDecoration: task.completed ? "line-through" : "none",
                }}
              >
                {task.title}
              </h1>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span
                  style={{
                    background: badge.bg,
                    color: badge.fg,
                    fontSize: "11.5px",
                    fontWeight: 700,
                    fontFamily: "var(--font-display)",
                    padding: "5px 10px",
                    borderRadius: "var(--radius-full)",
                  }}
                >
                  {badge.label}
                </span>
                <span style={{ fontSize: "12.5px", color: "var(--faint-foreground)" }}>
                  Created {formatShortDate(task.createdAt)}
                </span>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            <Button size="sm" variant="outline" onClick={() => onEdit(task)}>
              Edit
            </Button>
            <Button size="sm" variant="outline" style={{ color: "var(--destructive)" }} onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>

        <div style={{ height: 1, background: "var(--border)", margin: "24px 0" }} />

        <div style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--muted-foreground)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.03em" }}>
          Description
        </div>
        {task.description ? (
          <div style={{ fontSize: "14.5px", color: "#3d3956", lineHeight: 1.6 }}>{task.description}</div>
        ) : (
          <div style={{ fontSize: 14, color: "var(--faint-foreground)" }}>No description added.</div>
        )}
      </div>
    </div>
  );
}
