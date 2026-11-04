import type { AppRole } from "@/lib/auth";

/**
 * Studio access rules, kept in one place so the login page, the route guards
 * and the studio itself can never disagree.
 *
 * The studio is an internal tool: it is linked from nowhere on the public
 * site and is only reachable by typing /admin/login (or /login) directly.
 */
export const STUDIO_PATH = "/admin/studio";
export const STAFF_STUDIO_PATH = "/staff/studio";
export const STUDIO_LOGIN_PATH = "/admin/login";

/** Roles allowed to draft campaigns and publish to the newsroom. */
export const STUDIO_ROLES: AppRole[] = ["admin", "pm", "talent"];

export function canUseStudio(roles: readonly AppRole[] | null | undefined): boolean {
  if (!roles?.length) return false;
  return roles.some((role) => STUDIO_ROLES.includes(role));
}

export function isAdminRole(roles: readonly AppRole[] | null | undefined): boolean {
  return Boolean(roles?.includes("admin"));
}
