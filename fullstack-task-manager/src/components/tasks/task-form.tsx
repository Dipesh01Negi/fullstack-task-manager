"use client";

import { FormEvent, useEffect, useState } from "react";
import { Task, TaskInput, taskInputSchema } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const emptyTask: TaskInput = { title: "", description: "", due_date: null, priority: "Medium", category: "Personal", status: "Todo" };

export function TaskForm({ task, onSaved, onCancel }: { task?: Task | null; onSaved: (task: Task) => void; onCancel: () => void }) {
  const [form, setForm] = useState<TaskInput>(emptyTask);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(task ? {
      title: task.title,
      description: task.description ?? "",
      due_date: task.due_date,
      priority: task.priority,
      category: task.category,
      status: task.status
    } : emptyTask);
  }, [task]);

  function update<K extends keyof TaskInput>(key: K, value: TaskInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = taskInputSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Check the form fields.");
      return;
    }
    setSaving(true);
    try {
      const response = await fetch(task ? `/api/tasks/${task.id}` : "/api/tasks", {
        method: task ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data)
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Unable to save task.");
      onSaved(payload.task as Task);
      toast.success(task ? "Task updated." : "Task created.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  const selectClass = "h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary";
  return (
    <form onSubmit={submit} className="space-y-4">
      <div><label className="mb-1.5 block text-sm font-medium">Title</label><Input autoFocus maxLength={120} value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="e.g. Finish database assignment" required /></div>
      <div><label className="mb-1.5 block text-sm font-medium">Description</label><Textarea value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Add a few details..." /></div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><label className="mb-1.5 block text-sm font-medium">Due date</label><Input type="date" value={form.due_date ?? ""} onChange={(e) => update("due_date", e.target.value || null)} /></div>
        <div><label className="mb-1.5 block text-sm font-medium">Priority</label><select className={selectClass} value={form.priority} onChange={(e) => update("priority", e.target.value as TaskInput["priority"])}><option>Low</option><option>Medium</option><option>High</option></select></div>
        <div><label className="mb-1.5 block text-sm font-medium">Category</label><select className={selectClass} value={form.category} onChange={(e) => update("category", e.target.value as TaskInput["category"])}><option>Work</option><option>Study</option><option>Personal</option><option>Urgent</option></select></div>
        <div><label className="mb-1.5 block text-sm font-medium">Status</label><select className={selectClass} value={form.status} onChange={(e) => update("status", e.target.value as TaskInput["status"])}><option>Todo</option><option>In Progress</option><option>Done</option></select></div>
      </div>
      <div className="flex justify-end gap-2 pt-2"><Button type="button" variant="outline" onClick={onCancel}>Cancel</Button><Button type="submit" disabled={saving}>{saving ? "Saving..." : task ? "Save changes" : "Create task"}</Button></div>
    </form>
  );
}
