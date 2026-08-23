import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

/** The only five roles in the system. */
export type AppRole = "client" | "student" | "talent" | "pm" | "admin";

/** Where each role lands after sign-in. */
export const ROLE_HOME: Record<AppRole, string> = {
  client: "/portal/client",
  student: "/portal/student",
  talent: "/portal/talent",
  pm: "/portal/pm",
  admin: "/portal/admin",
};

/** When a user holds more than one role, the first match here wins. */
const ROLE_PRIORITY: AppRole[] = ["admin", "pm", "talent", "student", "client"];

type AuthState = {
  session: Session | null;
  user: User | null;
  role: AppRole | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthState>({
  session: null,
  user: null,
  role: null,
  loading: true,
  signOut: async () => {},
});

async function fetchPrimaryRole(userId: string): Promise<AppRole | null> {
  const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  if (error || !data?.length) return null;
  const roles = data.map((r) => r.role as AppRole);
  return ROLE_PRIORITY.find((r) => roles.includes(r)) ?? roles[0] ?? null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (!s?.user) {
        setRole(null);
        return;
      }
      // Defer the DB read out of the auth callback.
      setTimeout(() => {
        void fetchPrimaryRole(s.user.id).then(setRole);
      }, 0);
    });

    void supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session);
      if (data.session?.user) setRole(await fetchPrimaryRole(data.session.user.id));
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const value: AuthState = {
    session,
    user: session?.user ?? null,
    role,
    loading,
    signOut: async () => {
      await supabase.auth.signOut();
    },
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  return useContext(Ctx);
}

export function roleHome(role: AppRole | null | undefined): string {
  return role ? ROLE_HOME[role] : "/portal/client";
}
