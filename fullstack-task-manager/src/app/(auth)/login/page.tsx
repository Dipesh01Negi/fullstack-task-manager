import { Suspense } from "react";
import { AuthForm } from "@/components/auth/auth-form";

export default function LoginPage() {
  return <Suspense><div className="mb-8"><p className="text-sm font-medium text-muted-foreground">WELCOME BACK</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Sign in to Taskflow</h1><p className="mt-2 text-sm text-muted-foreground">Pick up where you left off.</p></div><AuthForm mode="login" /></Suspense>;
}
