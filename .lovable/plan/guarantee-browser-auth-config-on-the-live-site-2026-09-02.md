# Guarantee browser auth config on the live site

## The variables

Two public, build-time (browser-visible) variables. Both are safe to expose — they are the same values every Supabase frontend ships publicly.

- `VITE_SUPABASE_URL` = `https://uwhiftozhvrvtulwtrve.supabase.co`
- `VITE_SUPABASE_PUBLISHABLE_KEY` (anon key) =
  `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3aGlmdG96aHZydnR1bHd0cnZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4MTE0NTgsImV4cCI6MjA5ODM4NzQ1OH0.l3-CqLOBLQ6JlQjS2JaiTbqGnAnqEXAXoLQuZvAluS8`

These are already present in the project environment, and `vite.config.ts` already bridges them into the browser bundle. What is not guaranteed is that the **deploy build** sees them — that is the remaining gap.

## What to change

1. `vite.config.ts` — give the public bridge literal fallbacks to the two values above, so the browser bundle can never again compile with an empty backend URL/key regardless of how the deploy environment is populated. Keep environment values as the first choice.
2. Add a build-time assertion: if neither environment nor fallback yields both values, fail the build instead of shipping a broken auth bundle.
3. `src/lib/auth.tsx` — make session initialization non-throwing so a configuration problem degrades to "signed out" rather than a dead UI.

`src/integrations/supabase/client.ts` is auto-generated and stays untouched.

## Verify

- Confirm the freshly built browser asset contains `uwhiftozhvrvtulwtrve.supabase.co` and no `{}.SUPABASE_URL`.
- Publish, then from clean browser contexts on `ndh.com.ng`: sign up a disposable account, confirm, sign out, sign back in, land on the right portal, delete it. Start Google sign-in and confirm the provider flow opens.
- Console must show no "Missing Supabase environment variable(s)" and no failed auth requests.

I report success only with live-domain evidence, not preview or localhost.
