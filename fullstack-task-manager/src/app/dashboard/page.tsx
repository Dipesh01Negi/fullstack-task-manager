import { redirect } from "next/navigation";
import { LogOut, CheckSquare2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { TaskWorkspace } from "@/components/tasks/task-workspace";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@/components/auth/sign-out-button";

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2 font-semibold tracking-tight"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"><CheckSquare2 className="h-4 w-4" /></span>Taskflow</div>
          <div className="flex items-center gap-2"><span className="hidden max-w-48 truncate text-sm text-muted-foreground sm:block">{user.email}</span><ThemeToggle /><SignOutButton /></div>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
        <div className="mb-8"><p className="text-sm text-muted-foreground">WORKSPACE</p><h1 className="mt-1 text-3xl font-semibold tracking-tight">Good to see you.</h1><p className="mt-2 text-sm text-muted-foreground">A clear view of what needs your attention.</p></div>
        <TaskWorkspace />
      </div>
    </main>
  );
}
