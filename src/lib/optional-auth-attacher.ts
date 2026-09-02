import { createMiddleware } from '@tanstack/react-start';
import { supabase } from '@/integrations/supabase/client';

/** Best-effort bearer attachment. Public RPCs must continue when auth is unavailable. */
export const attachOptionalSupabaseAuth = createMiddleware({ type: 'function' }).client(
  async ({ next }) => {
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      return next({
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
    } catch (error) {
      console.warn('Authentication session was unavailable; continuing without a session.', error);
      return next({ headers: {} });
    }
  },
);