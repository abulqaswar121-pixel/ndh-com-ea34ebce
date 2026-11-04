import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Loader2, Lock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/lib/auth";
import { NdhFamilySymbol } from "@/components/NdhFamilySymbol";
import { STUDIO_PATH, canUseStudio } from "@/lib/studio/access";

/**
 * Hidden staff entrance at /admin/login.
 *
 * Nothing on the public site links here: the header, the mobile drawer, the
 * footer and the sitemap stay clean. Staff who open it directly sign in and
 * land straight in the studio at /admin/studio.
 */
export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Staff access — Najeeb Digital Hub" },
      {
        name: "description",
        content: "Private sign-in for NDH administrators and staff.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const { user, roles, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState<"email" | "google" | null>(null);

  const allowed = canUseStudio(roles);

  // Already signed in with a staff role → straight into the studio.
  useEffect(() => {
    if (user && allowed) void navigate({ to: STUDIO_PATH, replace: true });
  }, [user, allowed, navigate]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy("email");
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        const invalid = /invalid login credentials/i.test(error.message);
        toast.error(
          invalid
            ? "Email or password is incorrect. If you signed up with Google, use “Continue with Google”."
            : error.message,
        );
        return;
      }
      toast.success("Signed in. Opening the studio…");
    } catch (error) {
      console.error("Staff sign-in could not start", error);
      toast.error("Sign-in is temporarily unavailable. Refresh the page and try again.");
    } finally {
      setBusy(null);
    }
  }

  async function handleGoogle() {
    setBusy("google");
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: `${window.location.origin}/admin/login`,
      });
      if (result?.error) toast.error((result.error as Error).message ?? "Google sign-in failed");
    } catch (error) {
      console.error("Google sign-in could not start", error);
      toast.error("Google sign-in is temporarily unavailable. Refresh the page and try again.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <main className="studio-login">
      <div className="studio-login-card">
        <Link to="/" className="studio-login-back" aria-label="Back to ndhnet.com">
          <ArrowLeft size={16} aria-hidden="true" />
        </Link>

        <div className="studio-login-brand">
          <NdhFamilySymbol />
          <span>
            <strong>NAJEEB DIGITAL HUB</strong>
            <small>Staff &amp; admin access</small>
          </span>
        </div>

        {user && allowed ? (
          <p className="studio-login-note">
            <ShieldCheck size={16} aria-hidden="true" /> Opening the Content Studio…
          </p>
        ) : !authLoading && user && !allowed ? (
          <>
            <h1 className="studio-login-title">This account has no studio access</h1>
            <p className="studio-login-copy">
              You are signed in as <strong>{user.email}</strong>, but this account does not hold an
              admin, project-manager or talent role. Ask an NDH administrator for access, or sign
              out to use a staff account.
            </p>
            <div className="studio-login-actions">
              <button
                type="button"
                className="studio-btn studio-btn-dark"
                onClick={() => void signOut()}
              >
                Sign out
              </button>
              <Link to="/" className="studio-btn">
                Back to the site
              </Link>
            </div>
          </>
        ) : (
          <>
            <h1 className="studio-login-title">
              <Lock size={18} aria-hidden="true" /> Sign in to the studio
            </h1>
            <p className="studio-login-copy">
              Private entrance for NDH administrators and staff. Captions, flyers, motion clips and
              newsroom publishing live here.
            </p>

            <button
              type="button"
              className="studio-btn studio-btn-google"
              onClick={handleGoogle}
              disabled={busy !== null}
            >
              {busy === "google" ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                "Continue with Google"
              )}
            </button>

            <div className="studio-login-divider">
              <span /> or <span />
            </div>

            <form className="studio-login-form" onSubmit={handleSubmit}>
              <label htmlFor="staff-email">
                Work email
                <input
                  id="staff-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </label>
              <label htmlFor="staff-password">
                Password
                <input
                  id="staff-password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </label>
              <button type="submit" className="studio-btn studio-btn-dark" disabled={busy !== null}>
                {busy === "email" ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  "Sign in and open the studio"
                )}
              </button>
            </form>

            <p className="studio-login-foot">
              Not staff? <Link to="/">Return to ndhnet.com</Link>
            </p>
          </>
        )}
      </div>
    </main>
  );
}
