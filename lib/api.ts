import type { Task } from "@/lib/types";

async function parseErrorMessage(res: Response, fallback: string) {
  try {
    const body = await res.json();
    if (typeof body?.error === "string") return body.error as string;
  } catch {
    // response had no JSON body
  }
  return fallback;
}

export async function fetchTasks(): Promise<Task[]> {
  const res = await fetch("/api/tasks");
  if (!res.ok) {
    throw new Error(await parseErrorMessage(res, "Failed to load tasks."));
  }
  return res.json();
}

export async function createTask(input: {
  title: string;
  description: string;
}): Promise<Task> {
  const res = await fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    throw new Error(await parseErrorMessage(res, "Failed to create task."));
  }
  return res.json();
}

export async function updateTask(
  id: string,
  input: Partial<{
    title: string;
    description: string;
    completed: boolean;
  }>
): Promise<Task> {
  const res = await fetch(`/api/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    throw new Error(await parseErrorMessage(res, "Failed to update task."));
  }
  return res.json();
}

export async function deleteTask(id: string): Promise<void> {
  const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
  if (!res.ok && res.status !== 204) {
    throw new Error(await parseErrorMessage(res, "Failed to delete task."));
  }
}
