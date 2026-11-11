import { z } from "zod";

export const taskPrioritySchema = z.enum(["Low", "Medium", "High"]);
export const taskCategorySchema = z.enum(["Work", "Study", "Personal", "Urgent"]);
export const taskStatusSchema = z.enum(["Todo", "In Progress", "Done"]);

export const taskInputSchema = z.object({
  title: z.string().trim().min(1, "A task title is required.").max(120),
  description: z.string().trim().max(2000).default(""),
  due_date: z.string().nullable().optional(),
  priority: taskPrioritySchema.default("Medium"),
  category: taskCategorySchema.default("Personal"),
  status: taskStatusSchema.default("Todo")
});

export type TaskPriority = z.infer<typeof taskPrioritySchema>;
export type TaskCategory = z.infer<typeof taskCategorySchema>;
export type TaskStatus = z.infer<typeof taskStatusSchema>;
export type TaskInput = z.infer<typeof taskInputSchema>;

export interface Task extends TaskInput {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  due_date: string | null;
}

export interface TaskFilters {
  search: string;
  status: "All" | TaskStatus;
  priority: "All" | TaskPriority;
  category: "All" | TaskCategory;
  sort: "due_asc" | "due_desc" | "created_desc";
}
