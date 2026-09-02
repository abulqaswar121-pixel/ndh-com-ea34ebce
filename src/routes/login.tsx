import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth, roleHome } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import logo from "@/assets/ndh-logo-new.jpg";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Najeeb Digital Hub" },
      { name: "description", content: "Sign in to your Najeeb Digital Hub account." },
      { property: "og:title", content: "Sign in — Najeeb Digital Hub" },
      { property: "og:description", content: "Sign in to your Najeeb Digital Hub account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState<"email" | "google" | null>(null);

  useEffect(() => {
    if (user && role) void navigate({ to: roleHome(role) });
  }, [user, role, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading("email");
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        const invalid = /invalid login credentials/i.test(error.message);
        toast.error(
          invalid
            ? "Email or password is incorrect. If you created this account with Google, use “Continue with Google” instead."
            : error.message,
        );
      }
    } catch (error) {
      console.error("Sign-in could not start", error);
      toast.error("Sign-in is temporarily unavailable. Refresh the page and try again.");
    } finally {
      setLoading(null);
    }
  };

  const handleGoogle = async () => {
    setLoading("google");
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin + "/login",
      });
      if (result?.error) toast.error((result.error as Error).message ?? "Google sign-in failed");
    } catch (error) {
      console.error("Google sign-in could not start", error);
      toast.error("Google sign-in is temporarily unavailable. Refresh the page and try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-close" aria-label="Back to homepage">
          <ArrowLeft size={18} />
        </Link>
        <img src={logo} alt="Najeeb Digital Hub" width={48} height={48}  />
        <h1>Sign in</h1>

        <Button type="button" variant="outline" className="auth-oauth" onClick={handleGoogle} disabled={loading !== null}>
          {loading === "google" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Continue with Google"}
        </Button>

        <div className="auth-divider">
          <span className="h-px flex-1 bg-border" />
          or
          <span className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              
            />
          </div>
          <Button type="submit" disabled={loading !== null}>
            {loading === "email" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
          </Button>
        </form>

        <p className="auth-alt">
          No account? <Link to="/signup" >Create one</Link>
        </p>
      </div>
    </main>
  );
}
