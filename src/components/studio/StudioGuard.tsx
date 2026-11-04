import { Navigate } from "@tanstack/react-router";
import { Loader2, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import { STUDIO_LOGIN_PATH, STUDIO_PATH, canUseStudio } from "@/lib/studio/access";

/**
 * Client-side gate for every studio route.
 *
 * - Signed out → /admin/login (the hidden staff entrance).
 * - Signed in without a staff role → a plain refusal, with a way out.
 * - Signed in as admin, PM or talent → the studio.
 *
 * The gate protects the UI. Anything that touches private data must still
 * re-check the caller's role on the server (see `news.functions.ts` and the
 * `posts` row-level policies).
 */
export function StudioGuard({ children }: { children: ReactNode }) {
  const { user, roles, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="studio-gate-screen" role="status" aria-live="polite">
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
        <span>Checking studio access…</span>
      </div>
    );
  }

  if (!user) return <Navigate to={STUDIO_LOGIN_PATH} replace />;

  if (!canUseStudio(roles)) {
    return (
      <div className="studio-gate-screen">
        <div className="studio-gate-card">
          <span className="studio-gate-badge">
            <ShieldCheck size={16} aria-hidden="true" /> Restricted area
          </span>
          <h1>The studio is for NDH staff</h1>
          <p>
            Your account is signed in but does not hold an admin, project-manager or talent role.
            Ask an NDH administrator to grant studio access, or return to the public site.
          </p>
          <div className="studio-gate-actions">
            <a className="studio-btn studio-btn-dark" href="/">
              Back to ndhnet.com
            </a>
            <button type="button" className="studio-btn" onClick={() => void signOut()}>
              Sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export { STUDIO_PATH };
