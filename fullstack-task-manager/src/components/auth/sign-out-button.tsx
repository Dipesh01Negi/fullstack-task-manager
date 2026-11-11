"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const router = useRouter();
  async function signOut() {
    const { error } = await createClient().auth.signOut();
    if (error) { toast.error(error.message); return; }
    router.replace("/login");
    router.refresh();
  }
  return <Button variant="outline" size="sm" onClick={signOut}><LogOut className="h-3.5 w-3.5" /><span className="hidden sm:inline">Sign out</span></Button>;
}
