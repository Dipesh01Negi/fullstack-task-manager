"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const isLogin = mode === "login";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    try {
      const result = isLogin
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/dashboard` } });
      if (result.error) throw result.error;
      if (isLogin) {
        toast.success("Welcome back.");
        router.replace(searchParams.get("next") || "/dashboard");
        router.refresh();
      } else {
        toast.success("Account created. Check your email if confirmation is enabled.");
        if (result.data.session) {
          router.replace("/dashboard");
          router.refresh();
        }
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Authentication failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div><label className="mb-1.5 block text-sm font-medium">Email address</label><Input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required /></div>
      <div><label className="mb-1.5 block text-sm font-medium">Password</label><Input type="password" autoComplete={isLogin ? "current-password" : "new-password"} minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" required /></div>
      <Button className="w-full" type="submit" disabled={loading}>{loading ? "Please wait..." : isLogin ? "Sign in" : "Create account"}</Button>
      <p className="text-center text-sm text-muted-foreground">{isLogin ? "New to Taskflow?" : "Already have an account?"} <Link className="font-medium text-foreground underline-offset-4 hover:underline" href={isLogin ? "/signup" : "/login"}>{isLogin ? "Create an account" : "Sign in"}</Link></p>
    </form>
  );
}
