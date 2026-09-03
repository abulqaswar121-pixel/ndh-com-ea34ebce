import { Navigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useAuth, roleHome, type AppRole } from "@/lib/auth";
import { useEffect, useState, type ReactNode } from "react";

/**
 * Portal gate. Signed-out users go to /login; a signed-in user holding the
 * wrong role is sent to their own portal instead of seeing this one.
 *
 * This protects the UI only. Every server function and query that touches
 * private data must re-check the caller's role on the server.
 */
export function RequireRole({ role, children }: { role: AppRole; children: ReactNode }) {
  const { user, role: currentRole, roles, loading, signOut } = useAuth();

  const [waited, setWaited] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setWaited(true), 6000);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  // Role row not loaded yet — hold rather than bounce to the wrong place.
  if (!currentRole) {
    if (!waited) {
      return (
        <div className="grid min-h-screen place-items-center bg-background">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      );
    }
    return (
      <div className="grid min-h-screen place-items-center bg-background px-6">
        <div className="max-w-sm space-y-3 text-center">
          <h1 className="text-lg font-semibold">Your account isn’t set up yet</h1>
          <p className="text-sm text-muted-foreground">
            We couldn’t load your account access. Please try again in a moment, or contact support at
            hello@ndh.com.ng.
          </p>
          <button className="button" onClick={() => void signOut()}>
            Sign out
          </button>
        </div>
      </div>
    );
  }

  // A user may hold several roles (a client who also studies, for example).
  if (!roles.includes(role)) return <Navigate to={roleHome(currentRole)} replace />;


  return <>{children}</>;
}
