"use client";

import React from "react";
import { gsap } from "gsap";
import { Checkbox } from "@/components/ui/Checkbox";
import { formatShortDate } from "@/lib/format";
import { statusBadge } from "@/lib/task-ui";
import type { Task } from "@/lib/types";

export interface TaskRowProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onOpen: (task: Task) => void;
}

export function TaskRow({ task, onToggle, onEdit, onDelete, onOpen }: TaskRowProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const badge = statusBadge(task.completed);

  React.useEffect(() => {
    gsap.fromTo(
      rootRef.current,
      { opacity: 0, y: -8 },
      { opacity: 1, y: 0, duration: 0.28, ease: "power2.out" }
    );
  }, []);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Delete this task?")) return;
    gsap.to(rootRef.current, {
      opacity: 0,
      x: 20,
      height: 0,
      marginBottom: 0,
      paddingTop: 0,
      paddingBottom: 0,
      duration: 0.26,
      ease: "power2.in",
      onComplete: () => onDelete(task.id),
    });
  };

  const handleHover = (entering: boolean) => {
    gsap.to(rootRef.current, {
      y: entering ? -2 : 0,
      boxShadow: entering ? "0 6px 16px rgba(30,27,46,0.08)" : "none",
      duration: 0.16,
      ease: "power1.out",
    });
  };

  return (
    <div
      ref={rootRef}
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
      onClick={() => onOpen(task)}
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        padding: "16px 18px",
        display: "flex",
        alignItems: "flex-start",
        gap: 14,
        marginBottom: 10,
        cursor: "pointer",
      }}
    >
      <Checkbox checked={task.completed} onCheckedChange={() => onToggle(task.id)} style={{ marginTop: 2 }} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 15,
            color: task.completed ? "var(--faint-foreground)" : "var(--foreground)",
            textDecoration: task.completed ? "line-through" : "none",
          }}
        >
          {task.title}
        </div>
        {task.description && (
          <div style={{ fontSize: "13.5px", color: "var(--muted-foreground)", marginTop: 4, lineHeight: 1.5 }}>
            {task.description}
          </div>
        )}
      </div>

      <div style={{ fontSize: 12, color: "var(--faint-foreground)", whiteSpace: "nowrap", marginTop: 3 }}>
        {formatShortDate(task.createdAt)}
      </div>

      <div style={{ display: "flex", gap: 6, marginTop: 2 }}>
        <span
          style={{
            background: badge.bg,
            color: badge.fg,
            fontSize: "11.5px",
            fontWeight: 700,
            fontFamily: "var(--font-display)",
            padding: "5px 10px",
            borderRadius: "var(--radius-full)",
            whiteSpace: "nowrap",
          }}
        >
          {badge.label}
        </span>
      </div>

      <div style={{ display: "flex", gap: 4, marginTop: 1 }}>
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            onEdit(task);
          }}
          label="Edit task"
          hoverBg="var(--incomplete-bg)"
          hoverColor="var(--primary)"
        >
          ✎
        </IconButton>
        <IconButton onClick={handleDelete} label="Delete task" hoverBg="var(--destructive-soft)" hoverColor="var(--destructive)">
          🗑
        </IconButton>
      </div>
    </div>
  );
}

function IconButton({
  children,
  onClick,
  label,
  hoverBg,
  hoverColor,
}: {
  children: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
  label: string;
  hoverBg: string;
  hoverColor: string;
}) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      onClick={onClick}
      aria-label={label}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        border: "none",
        background: hover ? hoverBg : "transparent",
        color: hover ? hoverColor : "var(--faint-foreground)",
        cursor: "pointer",
        fontSize: 15,
        padding: "4px 6px",
        borderRadius: 6,
        transition: "background 120ms ease, color 120ms ease",
      }}
    >
      {children}
    </button>
  );
}
