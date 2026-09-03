// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { mcpPlugin } from "@lovable.dev/mcp-js/stacks/tanstack/vite";

// Public (browser-visible) backend values. These are the publishable URL/anon
// key — safe to ship in client code. Literal fallbacks guarantee the browser
// bundle is never built without auth configuration, whatever the deploy env.
const FALLBACK_BACKEND_URL = "https://uwhiftozhvrvtulwtrve.supabase.co";
const FALLBACK_BACKEND_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3aGlmdG96aHZydnR1bHd0cnZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4MTE0NTgsImV4cCI6MjA5ODM4NzQ1OH0.l3-CqLOBLQ6JlQjS2JaiTbqGnAnqEXAXoLQuZvAluS8";

const publicBackendUrl =
  process.env["VITE_SUPABASE_URL"] ?? process.env["SUPABASE_URL"] ?? FALLBACK_BACKEND_URL;
const publicBackendKey =
  process.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ??
  process.env["SUPABASE_PUBLISHABLE_KEY"] ??
  FALLBACK_BACKEND_KEY;

if (!publicBackendUrl || !publicBackendKey) {
  throw new Error(
    "Refusing to build: public backend URL/publishable key are missing, which would ship a broken authentication bundle.",
  );
}

const publicBackendDefinitions = {
  "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(publicBackendUrl),
  "import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY": JSON.stringify(publicBackendKey),
  "process.env.SUPABASE_URL": JSON.stringify(publicBackendUrl),
  "process.env.SUPABASE_PUBLISHABLE_KEY": JSON.stringify(publicBackendKey),
};


export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    // The managed Cloud bindings are available to the server build without a
    // VITE_ prefix. Explicitly bridge only these public values into browser
    // code so authentication can initialize on a fresh production visit.
    define: publicBackendDefinitions,
    plugins: [mcpPlugin()],
    server: {
      host: "0.0.0.0",
      port: 3000,
      allowedHosts: true,
      hmr: {
        clientPort: 443,
      },
    },
    preview: {
      host: "0.0.0.0",
      port: 3000,
    },
  },
});
