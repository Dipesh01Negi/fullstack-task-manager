import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { taskInputSchema } from "@/types/task";
import { jsonError } from "@/lib/http";

export async function GET() {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return jsonError("Authentication required.", 401);

  const { data, error } = await supabase.from("tasks").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
  if (error) return jsonError(error.message, 500);
  return NextResponse.json({ tasks: data });
}

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return jsonError("Authentication required.", 401);

  let body: unknown;
  try { body = await request.json(); } catch { return jsonError("Request body must be valid JSON."); }
  const parsed = taskInputSchema.safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Invalid task data.");

  const { data, error } = await supabase.from("tasks").insert({ ...parsed.data, user_id: user.id }).select("*").single();
  if (error) return jsonError(error.message, 500);
  return NextResponse.json({ task: data }, { status: 201 });
}
