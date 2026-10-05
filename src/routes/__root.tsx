import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  ClientOnly,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { Suspense, lazy, useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AuthProvider } from "../lib/auth";
import { Toaster } from "sonner";
import { DEFAULT_PREFERENCES, PreferencesProvider } from "../lib/preferences";
import { DEFAULT_LOCALE, localeDirection } from "../lib/i18n/dictionary";
import { readPreferences } from "../lib/preferences.functions";
const OmniHubChat = lazy(() =>
  import("@/components/omnihub/OmniHubChat").then((m) => ({ default: m.OmniHubChat })),
);

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error instanceof Error ? error : new Error(String(error)), {
      boundary: "tanstack_root_error_component",
    });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Najeeb Digital Hub" },
      { name: "author", content: "Najeeb Digital Hub" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Najeeb Digital Hub" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap",
      },
    ],
  }),
  /**
   * Read the region/language/currency cookie during SSR so the first paint is
   * already correct (no flash of English, no hydration mismatch). Cached for
   * client-side navigation because the provider owns the state after that.
   */
  staleTime: Number.POSITIVE_INFINITY,
  loader: async () => {
    try {
      return await readPreferences();
    } catch (error) {
      console.warn("Preferences unavailable during render, using defaults:", error);
      return { prefs: DEFAULT_PREFERENCES, stored: false };
    }
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  // The preference loader runs during SSR, so the document can declare the
  // visitor's language and direction before hydration (important for Arabic).
  let locale = DEFAULT_LOCALE;
  try {
    const data = Route.useLoaderData();
    if (data?.prefs?.locale) locale = data.prefs.locale;
  } catch {
    /* Shell rendered outside the route context — English defaults are fine. */
  }

  return (
    <html lang={locale} dir={localeDirection(locale)}>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const preferences = Route.useLoaderData();

  return (
    <QueryClientProvider client={queryClient}>
      <PreferencesProvider initial={preferences?.prefs} stored={preferences?.stored}>
        <AuthProvider>
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <Outlet />
          {/* Browser-only widget (session storage, streaming fetch) — never SSR'd. */}
          <ClientOnly fallback={null}>
            <Suspense fallback={null}>
              <OmniHubChat />
            </Suspense>
          </ClientOnly>
          <Toaster position="top-right" richColors />
        </AuthProvider>
      </PreferencesProvider>
    </QueryClientProvider>
  );
}
