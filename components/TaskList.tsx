"use client";

import React from "react";
import { gsap } from "gsap";
import { Input } from "@/components/ui/Input";
import { TaskRow } from "@/components/TaskRow";
import type { Task, TaskFilter } from "@/lib/types";

export interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  totalCount: number;
  search: string;
  onSearchChange: (value: string) => void;
  filter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
  counts: { total: number; incomplete: number; completed: number };
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onOpen: (task: Task) => void;
}

const TABS: { key: TaskFilter; label: string }[] = [
  { key: "all", label: "All Tasks" },
  { key: "incomplete", label: "Incomplete" },
  { key: "completed", label: "Completed" },
];

export function TaskList({
  tasks,
  loading,
  totalCount,
  search,
  onSearchChange,
  filter,
  onFilterChange,
  counts,
  onToggle,
  onEdit,
  onDelete,
  onOpen,
}: TaskListProps) {
  const listRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (listRef.current) {
      gsap.fromTo(
        listRef.current,
        { opacity: 0.3, y: 4 },
        { opacity: 1, y: 0, duration: 0.2, ease: "power1.out" }
      );
    }
  }, [filter, search]);

  return (
    <>
      <div
        style={{
          display: "flex",
          flexShrink: 0,
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
          marginBottom: 28,
          flexWrap: "wrap",
        }}
      >
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 28, margin: 0, letterSpacing: "-0.02em" }}>
          My Tasks
        </h1>
        <div style={{ position: "relative", width: "100%", maxWidth: 280, flex: "1 1 200px" }}>
          <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--placeholder)", fontSize: 14 }}>
            ⌕
          </span>
          <Input
            placeholder="Search by name"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{ paddingLeft: 34 }}
          />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexShrink: 0,
          flexWrap: "wrap",
          gap: 6,
          background: "var(--incomplete-bg)",
          padding: 5,
          borderRadius: 11,
          width: "fit-content",
          marginBottom: 22,
        }}
      >
        {TABS.map((tab) => {
          const active = filter === tab.key;
          const count = tab.key === "all" ? counts.total : tab.key === "incomplete" ? counts.incomplete : counts.completed;
          return (
            <button
              key={tab.key}
              onClick={() => onFilterChange(tab.key)}
              style={{
                border: "none",
                background: active ? "#fff" : "transparent",
                color: active ? "var(--foreground)" : "var(--muted-foreground)",
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: 13,
                padding: "9px 16px",
                borderRadius: 8,
                cursor: "pointer",
                boxShadow: active ? "var(--shadow-tab)" : "none",
              }}
            >
              {tab.label} <span style={{ opacity: 0.6, fontWeight: 500 }}>{count}</span>
            </button>
          );
        })}
      </div>

      <div ref={listRef} className="scroll-area">
        {loading ? (
          <EmptyState title="Loading tasks…" />
        ) : tasks.length === 0 ? (
          <EmptyState
            title={totalCount === 0 ? "No tasks yet" : "No tasks match"}
            subtitle={totalCount === 0 ? "Add your first task to get started." : "Try a different search or filter."}
          />
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {tasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                onToggle={onToggle}
                onEdit={onEdit}
                onDelete={onDelete}
                onOpen={onOpen}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function EmptyState({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div style={{ textAlign: "center", padding: "70px 0", color: "var(--faint-foreground)" }}>
      <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--muted-foreground)", marginBottom: 4 }}>
        {title}
      </div>
      {subtitle && <div style={{ fontSize: 13 }}>{subtitle}</div>}
    </div>
  );
}
