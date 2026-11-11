"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, ListTodo } from "lucide-react";
import { toast } from "sonner";
import { Task, TaskFilters } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { StatsOverview } from "./stats-overview";
import { FilterBar } from "./filter-bar";
import { TaskCard } from "./task-card";
import { TaskForm } from "./task-form";
import { Skeleton } from "@/components/ui/skeleton";

const initialFilters: TaskFilters = { search: "", status: "All", priority: "All", category: "All", sort: "due_asc" };

export function TaskWorkspace() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState<TaskFilters>(initialFilters);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/tasks", { cache: "no-store" });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Unable to load tasks.");
      setTasks(payload.tasks as Task[]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to load tasks.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadTasks(); }, [loadTasks]);

  const filteredTasks = useMemo(() => {
    const result = tasks.filter((task) => {
      const text = `${task.title} ${task.description ?? ""}`.toLowerCase();
      return (!filters.search || text.includes(filters.search.toLowerCase()))
        && (filters.status === "All" || task.status === filters.status)
        && (filters.priority === "All" || task.priority === filters.priority)
        && (filters.category === "All" || task.category === filters.category);
    });
    return result.sort((a, b) => {
      if (filters.sort === "created_desc") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      const first = a.due_date ? new Date(`${a.due_date}T00:00:00`).getTime() : Number.MAX_SAFE_INTEGER;
      const second = b.due_date ? new Date(`${b.due_date}T00:00:00`).getTime() : Number.MAX_SAFE_INTEGER;
      return filters.sort === "due_asc" ? first - second : second - first;
    });
  }, [tasks, filters]);

  function openCreate() { setEditing(null); setModalOpen(true); }
  function openEdit(task: Task) { setEditing(task); setModalOpen(true); }
  function saved(task: Task) {
    setTasks((current) => editing ? current.map((item) => item.id === task.id ? task : item) : [task, ...current]);
    setModalOpen(false);
    setEditing(null);
  }

  async function remove(task: Task) {
    if (!window.confirm(`Delete "${task.title}"? This cannot be undone.`)) return;
    try {
      const response = await fetch(`/api/tasks/${task.id}`, { method: "DELETE" });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Unable to delete task.");
      setTasks((current) => current.filter((item) => item.id !== task.id));
      toast.success("Task deleted.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete task.");
    }
  }

  async function toggle(task: Task) {
    const status = task.status === "Done" ? "Todo" : "Done";
    try {
      const response = await fetch(`/api/tasks/${task.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Unable to update task.");
      setTasks((current) => current.map((item) => item.id === task.id ? payload.task as Task : item));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update task.");
    }
  }

  return (
    <div className="space-y-6">
      <StatsOverview tasks={tasks} />
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><h2 className="text-lg font-semibold tracking-tight">Your tasks</h2><p className="mt-1 text-sm text-muted-foreground">Plan your work and keep the important things moving.</p></div><Button onClick={openCreate}><Plus className="h-4 w-4" />New task</Button></div>
      <FilterBar filters={filters} onChange={setFilters} />
      {loading ? <div className="grid gap-3">{[1, 2, 3].map((item) => <Skeleton key={item} className="h-28 w-full" />)}</div> : filteredTasks.length ? <div className="grid gap-3">{filteredTasks.map((task) => <TaskCard key={task.id} task={task} onEdit={openEdit} onDelete={remove} onToggle={toggle} />)}</div> : <div className="rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-muted"><ListTodo className="h-5 w-5 text-muted-foreground" /></div><h3 className="mt-4 font-medium">{tasks.length ? "No matching tasks" : "Your workspace is clear"}</h3><p className="mt-1 text-sm text-muted-foreground">{tasks.length ? "Try changing your filters or search query." : "Create your first task to get started."}</p>{!tasks.length && <Button className="mt-4" onClick={openCreate}><Plus className="h-4 w-4" />Create a task</Button>}</div>}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit task" : "Create a task"}><TaskForm task={editing} onSaved={saved} onCancel={() => setModalOpen(false)} /></Modal>
    </div>
  );
}
