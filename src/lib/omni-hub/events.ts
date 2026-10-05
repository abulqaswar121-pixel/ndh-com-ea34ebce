/**
 * Shared Omni-Hub events.
 *
 * Kept in a tiny module with no component imports so light-weight chrome (the
 * header, the family menu, the hero) can open the consultant without pulling
 * the lazily-loaded chat bundle into the eager graph.
 */

/** Window event any page control can dispatch to open the consultant. */
export const OPEN_ASSISTANT_EVENT = "ndh:open-assistant";

/** Open the consultant with an optional preset prompt. Safe during SSR. */
export function openAssistant(prompt = "") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(OPEN_ASSISTANT_EVENT, { detail: { prompt } }));
}
