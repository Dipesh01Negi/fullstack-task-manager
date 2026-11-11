import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { taskInputSchema } from "@/types/task";
import { jsonError } from "@/lib/http";
import { z } from "zod";

type RouteContext = { params: { id: string } };
const idSchema = z.string().uuid();

async function getUserClient() {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return { error: jsonError("Authentication required.", 401) };
  return { supabase, user };
}

export async function PATCH(request: Request, { params }: RouteContext) {
  if (!idSchema.safeParse(params.id).success) return jsonError("Invalid task ID.");
  const auth = await getUserClient();
  if ("error" in auth) return auth.error;

  let body: unknown;
  try { body = await request.json(); } catch { return jsonError("Request body must be valid JSON."); }
  const partialSchema = taskInputSchema.partial();
  const parsed = partialSchema.safeParse(body);
  if (!parsed.success || Object.keys(parsed.data ?? {}).length === 0) return jsonError(parsed.success ? "At least one field is required." : parsed.error.issues[0]?.message ?? "Invalid task data.");

  const { data, error } = await auth.supabase.from("tasks").update(parsed.data).eq("id", params.id).eq("user_id", auth.user.id).select("*").single();
  if (error) return jsonError(error.code === "PGRST116" ? "Task not found." : error.message, error.code === "PGRST116" ? 404 : 500);
  return NextResponse.json({ task: data });
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  if (!idSchema.safeParse(params.id).success) return jsonError("Invalid task ID.");
  const auth = await getUserClient();
  if ("error" in auth) return auth.error;

  const { data, error } = await auth.supabase.from("tasks").delete().eq("id", params.id).eq("user_id", auth.user.id).select("id").single();
  if (error) return jsonError(error.code === "PGRST116" ? "Task not found." : error.message, error.code === "PGRST116" ? 404 : 500);
  return NextResponse.json({ deleted: data.id });
}
