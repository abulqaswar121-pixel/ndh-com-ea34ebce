import type { ReactNode } from "react";

/**
 * Neutral empty page shell. Deliberately contains no marketing copy — the
 * page body is left for the implementation spec to fill in.
 */
export function PageShell({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-6 py-16">
      <h1 className="font-semibold text-2xl tracking-tight text-foreground">{title}</h1>
      {children}
    </main>
  );
}
