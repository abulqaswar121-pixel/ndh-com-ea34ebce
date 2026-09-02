# Repair production first-load content and authentication

## Confirmed state

- The published browser bundle is missing the build-time browser database URL and publishable key. This breaks direct email/Google authentication and can also reject client-side server-function calls during hydration.
- Public catalog functions are already unauthenticated and use a server-local publishable client, but their runtime configuration and error handling need hardening.
- The live database contains 30 published courses and 60 pricing rows. Posts, case studies, and testimonials currently contain no rows, so those pages must show honest empty states rather than outage messages.
- Anonymous published-row policies exist for courses, pricing, posts, case studies, and testimonials. The `course_outline` routine currently has no explicit privilege visible and must be corrected.
- The three primary homepage images are large PNG files without responsive variants or static cache rules. Favicons and a sitemap are absent.

## Implementation

### 1. Restore production browser configuration

- Re-bind the managed backend environment so the canonical browser and server variables are available to the build and runtime.
- Keep the generated browser client free of hardcoded project URLs or keys.
- Build and publish a new frontend deployment, then verify the shipped asset contains the injected browser URL/configuration and no longer compiles access to an empty environment object.

### 2. Decouple public data from auth failures

- Keep the global client token attacher because TanStack route middleware cannot attach headers to later server-function RPC calls.
- Make the global attacher best-effort and non-throwing: a missing/broken browser session adds no Authorization header but never blocks a public server function.
- Preserve `requireSupabaseAuth` on every protected server function as the actual security boundary.
- Keep public catalog and enquiry functions free of auth middleware.

### 3. Harden request-level server configuration

- Ensure the Worker copies request bindings before loading or invoking the TanStack handler on every request.
- Add a request-safe environment accessor used inside server-function handlers so both Worker bindings and `process.env` resolve consistently without module-level initialization.
- Never cache a failed database client; construct public clients only after valid request configuration is available.
- Return empty arrays only when the database query succeeds with zero rows. Continue throwing for a real backend outage so empty content is not confused with failure.

### 4. Verify and repair public database access

- Confirm grants as well as row policies for courses, pricing, posts, case studies, testimonials, and enquiry submission.
- Grant anonymous execution of `course_outline` while keeping its output limited to published course outlines.
- Preserve the existing 30-course seed and do not fabricate Blog, Work, or Testimonial content.

### 5. Asset and SEO corrections

- Convert the three large homepage PNGs to responsive WebP/AVIF variants sized for their rendered layouts.
- Add explicit dimensions, `srcSet`/`sizes`, eager/high-priority loading for the hero, and lazy loading for below-the-fold images.
- Add immutable cache headers for fingerprint-stable static image files.
- Generate a branded 1200×630 `/og-image.png`; reference its absolute custom-domain URL from each relevant public route.
- Add favicon and Apple touch icon files and root link tags.
- Add `/sitemap.xml` for public routes and reference it from `robots.txt`.
- Complete unique leaf-route metadata with `og:type` and `twitter:card` where missing.

## Production verification

After publishing the new frontend deployment, test only `https://ndh.com.ng`:

- Run repeated clean browser contexts on desktop and phone, opening `/`, `/academy`, one real course detail, `/blog`, `/work`, `/login`, and `/signup` directly as the first request.
- Record final URL, visible state, console errors, failed requests, and server-function status for every pass; no refresh is allowed.
- Confirm Blog and Work show truthful empty states because the database has no published entries.
- Create a disposable `client` or `student`, complete confirmation if required, sign out, sign back in, verify portal routing, and remove the test account.
- Start Google sign-in from the custom domain and verify the managed provider flow opens and returns to the public callback/origin correctly.
- Inspect the new production asset to prove browser configuration is injected and the old broken asset is no longer served.

## Completion standard

Do not report the issue fixed from localhost, preview, SSR-only output, or a refreshed page. Completion requires a clean build, a newly published asset, repeated fresh first-load passes on the custom domain, and successful real authentication evidence.
