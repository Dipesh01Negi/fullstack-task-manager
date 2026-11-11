import { CheckCircle2, Circle, Clock3, ListTodo } from "lucide-react";
import { Task } from "@/types/task";

export function StatsOverview({ tasks }: { tasks: Task[] }) {
  const items = [
    { label: "Total tasks", value: tasks.length, icon: ListTodo },
    { label: "To do", value: tasks.filter((task) => task.status === "Todo").length, icon: Circle },
    { label: "In progress", value: tasks.filter((task) => task.status === "In Progress").length, icon: Clock3 },
    { label: "Completed", value: tasks.filter((task) => task.status === "Done").length, icon: CheckCircle2 }
  ];
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {items.map(({ label, value, icon: Icon }) => (
        <div key={label} className="rounded-xl border border-border bg-card p-4 shadow-soft">
          <div className="flex items-center justify-between text-sm text-muted-foreground"><span>{label}</span><Icon className="h-4 w-4" /></div>
          <p className="mt-3 text-2xl font-semibold tracking-tight">{value}</p>
        </div>
      ))}
    </div>
  );
}
