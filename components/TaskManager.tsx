"use client";

import React from "react";
import { Sidebar } from "@/components/Sidebar";
import { TaskList } from "@/components/TaskList";
import { TaskDetail } from "@/components/TaskDetail";
import { TaskFormDialog } from "@/components/TaskFormDialog";
import { Button } from "@/components/ui/Button";
import { fetchTasks, createTask, updateTask, deleteTask } from "@/lib/api";
import type { Task, TaskFilter } from "@/lib/types";

type View = "list" | "detail";

export function TaskManager() {
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState<TaskFilter>("all");

  const [view, setView] = React.useState<View>("list");
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Task | null>(null);
  const [formTitle, setFormTitle] = React.useState("");
  const [formDesc, setFormDesc] = React.useState("");
  const [formError, setFormError] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    fetchTasks()
      .then(setTasks)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const openAdd = () => {
    setEditing(null);
    setFormTitle("");
    setFormDesc("");
    setFormError(null);
    setDialogOpen(true);
  };

  const openEdit = (task: Task) => {
    setEditing(task);
    setFormTitle(task.title);
    setFormDesc(task.description || "");
    setFormError(null);
    setDialogOpen(true);
  };

  const saveTask = async () => {
    if (!formTitle.trim()) {
      setFormError("Title is required.");
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      if (editing) {
        const updated = await updateTask(editing.id, {
          title: formTitle.trim(),
          description: formDesc.trim(),
        });
        setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      } else {
        const created = await createTask({
          title: formTitle.trim(),
          description: formDesc.trim(),
        });
        setTasks((prev) => [created, ...prev]);
      }
      setDialogOpen(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const toggleTask = async (id: string) => {
    const target = tasks.find((t) => t.id === id);
    if (!target) return;
    const nextCompleted = !target.completed;
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: nextCompleted } : t)));
    try {
      await updateTask(id, { completed: nextCompleted });
    } catch (err) {
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !nextCompleted } : t)));
      setError(err instanceof Error ? err.message : "Failed to update task.");
    }
  };

  const removeTask = async (id: string) => {
    const snapshot = tasks;
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (selectedId === id) {
      setView("list");
      setSelectedId(null);
    }
    try {
      await deleteTask(id);
    } catch (err) {
      setTasks(snapshot);
      setError(err instanceof Error ? err.message : "Failed to delete task.");
    }
  };

  const openDetail = (task: Task) => {
    setSelectedId(task.id);
    setView("detail");
  };

  const backToList = () => {
    setView("list");
    setSelectedId(null);
  };

  const filtered = tasks.filter((t) => {
    if (filter === "incomplete" && t.completed) return false;
    if (filter === "completed" && !t.completed) return false;
    if (search.trim()) {
      const query = search.trim().toLowerCase();
      const matchesWord = t.title.toLowerCase().split(/\s+/).some((word) => word.startsWith(query));
      if (!matchesWord) return false;
    }
    return true;
  });

  const counts = {
    total: tasks.length,
    incomplete: tasks.filter((t) => !t.completed).length,
    completed: tasks.filter((t) => t.completed).length,
  };

  const selectedTask = tasks.find((t) => t.id === selectedId) ?? null;

  return (
    <div className="app-shell" style={{ background: "var(--background)", color: "var(--foreground)" }}>
      <Sidebar
        counts={{ total: counts.total, active: counts.incomplete, completed: counts.completed }}
        onAddClick={openAdd}
      />

      <div className="main-content">
        {error && (
          <div
            role="alert"
            style={{
              display: "flex",
              flexShrink: 0,
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              background: "var(--destructive-soft)",
              color: "var(--destructive)",
              border: "1px solid var(--destructive)",
              borderRadius: "var(--radius)",
              padding: "10px 14px",
              marginBottom: 20,
              fontSize: 13,
            }}
          >
            <span>{error}</span>
            <Button size="sm" variant="ghost" style={{ color: "var(--destructive)" }} onClick={() => setError(null)}>
              Dismiss
            </Button>
          </div>
        )}

        {view === "detail" && selectedTask ? (
          <TaskDetail
            task={selectedTask}
            onBack={backToList}
            onToggle={toggleTask}
            onEdit={openEdit}
            onDelete={removeTask}
          />
        ) : (
          <TaskList
            tasks={filtered}
            loading={loading}
            totalCount={tasks.length}
            search={search}
            onSearchChange={setSearch}
            filter={filter}
            onFilterChange={setFilter}
            counts={counts}
            onToggle={toggleTask}
            onEdit={openEdit}
            onDelete={removeTask}
            onOpen={openDetail}
          />
        )}
      </div>

      <TaskFormDialog
        open={dialogOpen}
        isEditing={!!editing}
        title={formTitle}
        description={formDesc}
        error={formError}
        saving={saving}
        onTitleChange={setFormTitle}
        onDescriptionChange={setFormDesc}
        onCancel={() => setDialogOpen(false)}
        onSave={saveTask}
      />
    </div>
  );
}
