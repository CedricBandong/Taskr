"use client";

import { Dialog, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
export interface TaskFormDialogProps {
  open: boolean;
  isEditing: boolean;
  title: string;
  description: string;
  error: string | null;
  saving: boolean;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onCancel: () => void;
  onSave: () => void;
}

export function TaskFormDialog({
  open,
  isEditing,
  title,
  description,
  error,
  saving,
  onTitleChange,
  onDescriptionChange,
  onCancel,
  onSave,
}: TaskFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onCancel()}>
      <DialogContent>
        <DialogTitle>{isEditing ? "Edit Task" : "New Task"}</DialogTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <Label htmlFor="task-title">Task title</Label>
            <Input
              id="task-title"
              placeholder="e.g. Write API documentation"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="task-desc">Description</Label>
            <Textarea
              id="task-desc"
              placeholder="Optional details"
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
            />
          </div>
          {error && <div style={{ fontSize: "12.5px", color: "var(--destructive)" }}>{error}</div>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={onSave} disabled={saving}>
            {saving ? "Saving…" : isEditing ? "Save Changes" : "Add Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
