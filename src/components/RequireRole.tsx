import { Navigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useAuth, roleHome, type AppRole } from "@/lib/auth";
import type { ReactNode } from "react";

/**
 * Portal gate. Signed-out users go to /login; a signed-in user holding the
 * wrong role is sent to their own portal instead of seeing this one.
 *
 * This protects the UI only. Every server function and query that touches
 * private data must re-check the caller's role on the server.
 */
export function RequireRole({ role, children }: { role: AppRole; children: ReactNode }) {
  const { user, role: currentRole, loading } = useAuth();

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
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (currentRole !== role) return <Navigate to={roleHome(currentRole)} replace />;

  return <>{children}</>;
}
