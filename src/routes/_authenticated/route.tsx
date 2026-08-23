import { createFileRoute, Outlet } from "@tanstack/react-router";

/**
 * Pathless layout for every signed-in area. SSR is off because the Supabase
 * session lives in localStorage, which the server cannot read — gating this
 * subtree server-side would loop on hard refresh.
 *
 * The actual role check for each portal lives in <RequireRole>.
 */
export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  component: () => <Outlet />,
});
