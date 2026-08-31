# Repair live authentication and first-load content

## Confirmed causes

1. **Authentication is genuinely broken on the live site.** The current `ndh.com.ng` JavaScript bundle logs that its browser authentication URL and publishable key are missing. Both email and Google flows reach the same unconfigured browser client, throw before completing authentication, and the catch blocks convert that error into “temporarily unavailable.” The authentication backend itself is online and both email and Google are enabled.
2. **The pages that recover after refresh have a separate server bug.** Academy, Blog, and Work fetch their initial content through server functions. The custom Worker entry forwards environment bindings but does not expose them where the server database client reads them. A cold request can therefore fail and render each route’s “unavailable—refresh” error boundary; a later warm request may succeed.
3. **Earlier verification was inadequate.** It relied mainly on localhost/fresh preview behavior, where environment variables were present. It did not prove that the currently published `ndh.com.ng` bundle contained its browser configuration or that cold production requests worked. The cache explanation was incorrect.

## Repair

### 1. Restore live browser authentication configuration

- Repair the Lovable Cloud build-time environment injection so the published bundle receives the generated browser URL and publishable key.
- Keep private credentials server-only and do not hardcode keys in application source.
- Rebuild/redeploy the live bundle after configuration is restored; verify the new asset rather than reusing the currently broken asset.
- Preserve the existing secure signup rule: users may self-select only `client` or `student`; privileged roles remain admin-assigned.

### 2. Fix cold-request server configuration

- Update the custom server entry to bridge the Worker’s environment bindings on **every request** before the TanStack server handler or server functions execute.
- Ensure server-side clients read the request’s current environment reliably instead of depending on a previously warmed runtime.
- Avoid caching a failed database-client initialization.

### 3. Make public content loading robust

- Replace privileged admin-client reads in the public catalog with a server-local publishable client and the existing narrow public read policies.
- Keep enquiry submission limited to its intended insert operation.
- Retain route error states for genuine outages, but remove the current refresh-dependent behavior; a first visit must either return real content or a truthful empty state.

### 4. Production-only verification

Test `https://ndh.com.ng` in multiple brand-new browser contexts with no prior storage:

- Open `/`, `/academy`, a course detail, `/blog`, `/work`, `/login`, and `/signup` directly as first requests; repeat on desktop and phone viewports.
- Confirm no page needs a refresh and no “unavailable” fallback appears.
- Confirm the console has no missing-environment or authentication-initialization errors and inspect all failed/4xx/5xx requests.
- Create a disposable email account, confirm its profile and allowed default role, sign out, sign back in, reach the correct portal, then remove the account.
- Start Google sign-in on the custom domain and confirm the managed provider flow opens/returns correctly.
- Run several cold/new-context passes—not just one warm pass—and confirm the latest build is clean.

## Completion standard

Do not report this fixed based on localhost, preview rendering, or a successful refresh. It is complete only when fresh first visits and real authentication both pass on `ndh.com.ng` with recorded browser/network evidence.
