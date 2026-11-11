"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { TaskFilters } from "@/types/task";

export function FilterBar({ filters, onChange }: { filters: TaskFilters; onChange: (filters: TaskFilters) => void }) {
  const selectClass = "h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary";
  function update<K extends keyof TaskFilters>(key: K, value: TaskFilters[K]) {
    onChange({ ...filters, [key]: value });
  }
  return (
    <div className="rounded-xl border border-border bg-card p-3 shadow-soft">
      <div className="flex flex-col gap-3 xl:flex-row">
        <div className="relative min-w-48 flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input className="pl-9" placeholder="Search tasks..." value={filters.search} onChange={(e) => update("search", e.target.value)} /></div>
        <div className="flex flex-wrap gap-2"><span className="flex items-center gap-1.5 px-1 text-xs text-muted-foreground"><SlidersHorizontal className="h-3.5 w-3.5" />Filter</span>
          <select aria-label="Filter by status" className={selectClass} value={filters.status} onChange={(e) => update("status", e.target.value as TaskFilters["status"])}><option value="All">All statuses</option><option>Todo</option><option>In Progress</option><option>Done</option></select>
          <select aria-label="Filter by priority" className={selectClass} value={filters.priority} onChange={(e) => update("priority", e.target.value as TaskFilters["priority"])}><option value="All">All priorities</option><option>Low</option><option>Medium</option><option>High</option></select>
          <select aria-label="Filter by category" className={selectClass} value={filters.category} onChange={(e) => update("category", e.target.value as TaskFilters["category"])}><option value="All">All categories</option><option>Work</option><option>Study</option><option>Personal</option><option>Urgent</option></select>
          <select aria-label="Sort tasks" className={selectClass} value={filters.sort} onChange={(e) => update("sort", e.target.value as TaskFilters["sort"])}><option value="due_asc">Due date ↑</option><option value="due_desc">Due date ↓</option><option value="created_desc">Recently created</option></select>
        </div>
      </div>
    </div>
  );
}
