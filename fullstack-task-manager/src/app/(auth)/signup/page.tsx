import { AuthForm } from "@/components/auth/auth-form";

export default function SignupPage() {
  return <><div className="mb-8"><p className="text-sm font-medium text-muted-foreground">GET STARTED</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Create your account</h1><p className="mt-2 text-sm text-muted-foreground">Your tasks, organized in one place.</p></div><AuthForm mode="signup" /></>;
}
