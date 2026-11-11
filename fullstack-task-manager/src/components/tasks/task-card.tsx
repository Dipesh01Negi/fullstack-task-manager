"use client";

import { CalendarDays, Check, Circle, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Task } from "@/types/task";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

const priorityStyles = {
  Low: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  Medium: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  High: "bg-rose-500/10 text-rose-700 dark:text-rose-400"
};

export function TaskCard({ task, onEdit, onDelete, onToggle }: { task: Task; onEdit: (task: Task) => void; onDelete: (task: Task) => void; onToggle: (task: Task) => void }) {
  return (
    <article className={`group rounded-xl border border-border bg-card p-4 shadow-soft transition hover:border-foreground/20 ${task.status === "Done" ? "opacity-75" : ""}`}>
      <div className="flex items-start gap-3">
        <button onClick={() => onToggle(task)} aria-label={task.status === "Done" ? "Mark as not done" : "Mark as done"} className="mt-0.5 rounded-full text-muted-foreground transition hover:text-primary">
          {task.status === "Done" ? <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground"><Check className="h-3 w-3" /></span> : <Circle className="h-5 w-5" />}
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3 className={`font-medium ${task.status === "Done" ? "text-muted-foreground line-through" : ""}`}>{task.title}</h3>
            <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
              <Button size="icon" variant="ghost" aria-label="Edit task" onClick={() => onEdit(task)}><Pencil className="h-3.5 w-3.5" /></Button>
              <Button size="icon" variant="ghost" aria-label="Delete task" onClick={() => onDelete(task)}><Trash2 className="h-3.5 w-3.5 text-red-500" /></Button>
            </div>
          </div>
          {task.description && <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">{task.description}</p>}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge className={priorityStyles[task.priority]}>{task.priority}</Badge>
            <Badge>{task.category}</Badge>
            <Badge>{task.status}</Badge>
            {task.due_date && <span className="ml-auto inline-flex items-center gap-1 text-xs text-muted-foreground"><CalendarDays className="h-3.5 w-3.5" />{formatDate(task.due_date)}</span>}
          </div>
        </div>
      </div>
    </article>
  );
}
