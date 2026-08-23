import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth, roleHome } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import logo from "@/assets/ndh-logo-new.jpg";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create an account — Najeeb Digital Hub" },
      { name: "description", content: "Create a Najeeb Digital Hub account." },
      { property: "og:title", content: "Create an account — Najeeb Digital Hub" },
      { property: "og:description", content: "Create a Najeeb Digital Hub account." },
    ],
  }),
  component: SignupPage,
});

/**
 * The account type below is a HINT only. The database signup trigger accepts
 * nothing but 'client' or 'student' and falls back to 'client' for anything
 * else, so talent / pm / admin can never be obtained by signing up.
 */
function SignupPage() {
  const { user, role: currentRole } = useAuth();
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState<"client" | "student">("client");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && currentRole) void navigate({ to: roleHome(currentRole) });
  }, [user, currentRole, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: fullName, role: accountType },
      },
    });
    setLoading(false);
    if (error) toast.error(error.message);
  };

  const handleGoogle = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/signup",
    });
    if (result?.error) toast.error((result.error as Error).message ?? "Google sign-up failed");
  };

  return (
    <main className="grid min-h-screen place-items-center bg-background px-6 py-12">
      <div className="w-full max-w-sm">
        <img src={logo} alt="Najeeb Digital Hub" width={48} height={48} className="mb-6 h-12 w-12 rounded-full object-cover" />
        <h1 className="font-semibold text-2xl tracking-tight text-foreground">Create your account</h1>

        <div className="mt-6 grid grid-cols-2 gap-2 rounded-lg border border-border p-1">
          {(["client", "student"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setAccountType(t)}
              className={`rounded-md px-3 py-2 text-sm font-medium capitalize transition ${
                accountType === t ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <Button type="button" variant="outline" className="mt-4 w-full" onClick={handleGoogle}>
          Continue with Google
        </Button>

        <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          or
          <span className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div>
            <label htmlFor="fullName" className="text-sm font-medium text-foreground">Full name</label>
            <input
              id="fullName"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-foreground">Password</label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account? <Link to="/login" className="font-medium text-foreground">Sign in</Link>
        </p>
      </div>
    </main>
  );
}
