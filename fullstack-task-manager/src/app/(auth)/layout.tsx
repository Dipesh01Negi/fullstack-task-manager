import Link from "next/link";
import { CheckSquare2 } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col">
      <header className="flex h-16 items-center justify-between px-6 lg:px-10">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"><CheckSquare2 className="h-4 w-4" /></span>Taskflow</Link>
        <ThemeToggle />
      </header>
      <div className="flex flex-1 items-center justify-center px-4 py-12"><div className="w-full max-w-sm">{children}</div></div>
      <footer className="pb-6 text-center text-xs text-muted-foreground">A calmer way to get things done.</footer>
    </main>
  );
}
