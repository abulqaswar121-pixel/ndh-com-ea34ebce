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
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: { full_name: fullName, role: accountType },
        },
      });
      if (error) {
        const exists = /already registered|user_already_exists/i.test(error.message);
        toast.error(
          exists
            ? "An account with this email already exists — sign in instead, or use Continue with Google."
            : error.message,
        );
        return;
      }
      toast.success("Check your email to confirm your account, then sign in.");
    } catch (error) {
      console.error("Account creation could not start", error);
      toast.error("Account creation is temporarily unavailable. Refresh the page and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin + "/signup",
      });
      if (result?.error) toast.error((result.error as Error).message ?? "Google sign-up failed");
    } catch (error) {
      console.error("Google sign-up could not start", error);
      toast.error("Google sign-up is temporarily unavailable. Refresh the page and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <img src={logo} alt="Najeeb Digital Hub" width={48} height={48}  />
        <h1>Create your account</h1>

        <div className="auth-toggle">
          {(["client", "student"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setAccountType(t)}
              className={accountType === t ? "is-active" : ""}
            >
              {t}
            </button>
          ))}
        </div>

        <Button type="button" variant="outline" className="auth-oauth" onClick={handleGoogle} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Continue with Google"}
        </Button>

        <div className="auth-divider">
          <span className="h-px flex-1 bg-border" />
          or
          <span className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div>
            <label htmlFor="fullName" >Full name</label>
            <input
              id="fullName"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              
            />
          </div>
          <div>
            <label htmlFor="email" >Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              
            />
          </div>
          <div>
            <label htmlFor="password" >Password</label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create account"}
          </Button>
        </form>

        <p className="auth-alt">
          Already have an account? <Link to="/login" >Sign in</Link>
        </p>
      </div>
    </main>
  );
}
