// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { mcpPlugin } from "@lovable.dev/mcp-js/stacks/tanstack/vite";

const publicBackendUrl = process.env["VITE_SUPABASE_URL"] ?? process.env["SUPABASE_URL"];
const publicBackendKey =
  process.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ?? process.env["SUPABASE_PUBLISHABLE_KEY"];

const publicBackendDefinitions =
  publicBackendUrl && publicBackendKey
    ? {
        "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(publicBackendUrl),
        "import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY": JSON.stringify(publicBackendKey),
        "process.env.SUPABASE_URL": JSON.stringify(publicBackendUrl),
        "process.env.SUPABASE_PUBLISHABLE_KEY": JSON.stringify(publicBackendKey),
      }
    : undefined;

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
