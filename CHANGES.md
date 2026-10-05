# NDH Changes

- `src/lib/academy.functions.ts` — server-side Academy Exam and project generation/review actions.
- `src/lib/admin.functions.ts` — Admin-only review, certificate, PM access, and invitation actions.
- `src/lib/payment.functions.ts` — server-side Paystack transaction initialization hook.
- `src/routes/_authenticated/portal/admin.tsx` — Admin queue, invitations, PM access, payout queue, user search, and Course Editor.
- `src/routes/_authenticated/portal/student.tsx` — enrolled courses, progress, and certificate list.
- `src/routes/_authenticated/certificate.$id.tsx` — student-owned certificate view and print/download action.
- `src/routes/_authenticated/exam.$slug.tsx` — Exam timer, question form, submission, and score display.
- `src/routes/_authenticated/learning.$slug.tsx` — ordered lessons and student progress writes.
- `src/routes/_authenticated/project.$slug.tsx` — AI brief generation and project submission.
- `src/styles.css` — visual/responsive styling retained from staged work.
- `supabase/migrations/20260826100000_stage5_academy_flow.sql` — student progress, Exam attempt, and project tables with RLS.

Generated Supabase clients/types, route tree, auth infrastructure, `.env`, Supabase config, and SupportChat were not edited.
- `supabase/migrations/20260827090000_payments_and_certificates.sql` — Paystack transaction record and verified-payment enrollment activation function.
- `src/routes/api/public/paystack-webhook.ts` — verified Paystack webhook endpoint using Web Crypto signature validation and server-side enrollment activation.
- `src/routeTree.gen.ts` — regenerated automatically by TanStack Start to register newly added routes; not manually edited.

## Ecosystem gateway v2 + Omni-Hub AI consultant

New subsystem powering the parent brand. The gateway is deliberately written as
a **holding-brand landing page**: every business in the family is presented on
equal footing, and no single subsidiary dominates the page.

### Added

- `src/lib/ecosystem.ts` — single source of truth for the NDH family: subsidiaries, categories, sector icons, live-status metrics, talent-network coverage and the "Why NDH" bento cards.
- `src/lib/region.ts` — region model and timezone-based auto-detection. There is no currency layer by design: the parent site publishes no prices.
- `src/lib/i18n/dictionary.ts` — translation dictionaries for **English, French and Arabic**, locale list with text direction, and `translate()` with English fallback.
- `src/lib/preferences.tsx` + `src/lib/preferences.functions.ts` — language preference (read from a cookie **on the server** during SSR, written from the click handler) plus silent, automatic region detection.
- `src/lib/omni-hub/engine.ts` — deterministic routing engine: intent classification across the whole family, scope/timeline qualification, course recommendation over the 30-course catalogue, and card/handoff composition. It quotes no prices, by design.
- `src/routes/api/public/omni-hub.ts` — streaming consultant endpoint. Streams the engine answer when no model key is configured, and passes the routing decision to the model as grounding when one is. Degrades to the engine on any upstream failure.
- `src/components/omnihub/OmniHubChat.tsx` — the consultant UI: quick actions covering every business, streaming answers, routing cards, course recommendations, qualifying questions, reset, and animated avatar states. Exposes the `ndh:open-assistant` event so page CTAs can pre-brief it.
- `src/components/ecosystem/AppSwitcher.tsx` — universal app-switcher for every business (also inside the mobile navigation panel).
- `src/components/ecosystem/LanguageMenu.tsx` — English / French / Arabic switcher; the only visitor-facing preference.
- `src/components/ecosystem/EcosystemDirectory.tsx` — category-filtered directory, controlled by the page so the hero's quick paths can open the right category.
- `src/components/ecosystem/LiveStatusBar.tsx` — group-level metrics strip with count-up animation that starts from the real server-rendered figure.
- `src/components/ecosystem/WhyNdhBento.tsx` — family-level bento whose lead card shows the shared identity system (one Open Gateway symbol wearing each business's sector icon).
- `src/lib/static-catalogue.ts` — offline mirror of the published 30 courses and 3 posts, generated from the seed migrations.

### Changed

- `src/routes/index.tsx` — gateway rebuilt around family-level sections (directory → why NDH → live status → foundation → consultant). Quick paths now filter the directory instead of funnelling into one business; the footer lists the whole family.
- `src/routes/__root.tsx` — reads the language cookie during SSR (`staleTime: Infinity`), wraps the tree in `PreferencesProvider`, renders `<html lang dir>`, and loads the consultant instead of the old support chat.
- `src/components/PageShell.tsx` — app-switcher and language menu added to the header and the mobile panel.
- `src/styles.css` — new `--gw-*` token block and gateway component styles (appended; existing rules untouched).
- `src/lib/catalog.functions.ts` — public reads fail open: courses and posts fall back to the offline catalogue, student voices / testimonials / case studies fall back to an intentional empty state instead of an error page.
- Removed `src/components/SupportChat.tsx`, `src/routes/api/public/support-chat.ts`, `src/lib/pricing.ts` and the investment-band section (superseded; `src/routeTree.gen.ts` regenerated automatically).

### Operating notes

- **Adding a business**: edit `SUBSIDIARIES` in `src/lib/ecosystem.ts` and add its `eco.<id>.name/tagline/description/point1/point2` keys. The directory, switcher, consultant, footer and structured data all follow.
- **Adding a language**: append a dictionary to `src/lib/i18n/dictionary.ts` and a `LOCALES` entry; missing keys fall back to English, so partial translations are safe to ship. Arabic is already wired for RTL.
- **Region** is detected from the browser timezone and passed to the consultant only. It is not a user-facing control and does not affect any price.
- **Model key**: set `LOVABLE_API_KEY` to upgrade the consultant from instant routing to model-written answers. Without it, every route still works.

## Gateway rounding pass — light/dark balance, family header, sharper consultant

Follow-up on visitor feedback: the page read as dark from top to bottom, leaned
on talent and certificate language, and the header and consultant needed work.

### Changed

- `src/routes/index.tsx` — the page now alternates **dark brand moments with light reading surfaces**. The hero (and the closing CTA) stay on the midnight-navy canvas; the quick paths, the full business directory and the foundation section sit on white. Sections are wrapped in `gw-band` elements (`gw-band-hero`, `gw-band-light`, `gw-band-canvas`, `gw-band-tail`) so the rhythm is declared in the markup, not guessed in CSS.
- `src/styles.css` — light bands re-declare the `--gw-*` tokens (ink, muted ink, lines, accents, shadows) so every component inside them stays token-only. Dark-only decorations (filter chips, dashed "next" card, pillar tiles, path arrows) get light variants. Header rebuilt into three zones (brand · family + page nav · tools + actions) with a compact consultant button, and the gateway gained a mobile drawer.
- `src/components/ecosystem/FamilyMenu.tsx` — new header dropdown: every business listed once under its primary category, each with sector icon and tagline, plus "see all businesses" and "AI consultant" actions. It is also used on every `PageShell` page, which is why the flat nav got shorter.
- `src/lib/omni-hub/engine.ts` — conversation continuity. The engine now recognises its own qualifying question, so "This week", "Complete beginner" or "Design & brand" continue the route that asked instead of restarting; new `about`, `contact`, `help` and `thanks` intents answer questions about the family itself; a message naming two businesses answers for both; French and Arabic keywords route correctly (word boundaries no longer break non-Latin scripts); price questions always explain how pricing works even when they route to a business.
- `src/lib/chat-brief.ts` — the model brief now describes the family rather than one agency, forbids restarting mid-conversation, and keeps the no-prices rule.
- `src/routes/api/public/omni-hub.ts` — grounding carries the turn count, a "do not restart" instruction and the continuity rule; accepts the identifier of the question a follow-up answers.
- `src/components/omnihub/OmniHubChat.tsx` — quick actions now open with "What NDH does" and span learning, commerce, schools, delivery and venture backing; the event name moved to `src/lib/omni-hub/events.ts` so page chrome can open the consultant without pulling the chat bundle.
- `src/lib/i18n/dictionary.ts` — talent and certificate language removed across **English, French and Arabic**: `bento.talent.*` → `bento.toolkit.*`, `bento.verified.*` → `bento.platforms.*`, `home.trust.verify` → `home.trust.support`, `metric.vettedTalents` → `metric.specialists`, `metric.talentCountries` → `metric.countriesServed`, category "Education & Talent" → "Education & Skills", Academy/Agency/Venture copy rewritten. `chat.chip.verify`, `chat.chip.talent` and `chat.chip.track` are gone; `chat.chip.family`, `nav.family`, `nav.consultant`, `nav.status` and `nav.talkToUs` were added. 193 keys per language.
- `src/components/ecosystem/WhyNdhBento.tsx` — the two removed cards became a commerce card (`bento.toolkit`) and a "not only digital services" card (`bento.platforms`) covering SchoolDesk, Travel and iHospital.
- `src/components/PageShell.tsx` — footer no longer advertises the talent application or certificate verification; header nav is family-first and the tagline speaks for the group.
- Removed the superseded `src/components/SupportChat.tsx` and `src/routes/api/public/support-chat.ts` (the Omni-Hub consultant replaced them; `src/routeTree.gen.ts` regenerated automatically).

### Notes

- The certificate check itself still exists at `/verify` and answers when someone asks for it directly in the consultant — it is simply no longer promoted anywhere on the parent surface.
- The light bands are pure CSS: adding a section to a band is enough for it to inherit the light token set.

## Gateway white pass — one nav dropdown, true white, no consultant pitch

Second round of visitor feedback: the "light" bands still read as tinted rather
than white, and the header carried two dropdowns, a hamburger and a consultant
button, with the navigation sitting hard against the logo. This pass settles all
of it.

### Changed

- `src/styles.css` — the reading bands are now **pure white** (`#ffffff`) and
  borrow the palette of the consultant chat the visitor liked: hairline
  `#e4e7ec` borders, `#f5f6f8` tiles, the `#1a4a6e` accent and the same soft
  shadows. Cards, quick paths, filter chips, pillar tiles and panels all sit on
  white; the tinted gradients and sheen layers are gone from these bands. The
  header is a white sticky bar (95% white, hairline base, hairline shadow) that
  works over both white and dark bands. The hero, the bento/live-status band and
  the closing CTA keep the midnight canvas, so the page still opens and closes on
  the brand — two white bands and two dark bands, alternating.
- `src/components/ecosystem/FamilyMenu.tsx` — rewritten as the **single**
  navigation dropdown: the family directory grouped by category with sector
  icons and taglines, the page links, the language switcher and the panel's own
  call to action, on the chat palette. Below 1100px it becomes a full-height
  sheet pinned to the viewport; it renders closed on the server, needs no
  browser API until opened, and closes on Escape, on outside click and on
  navigation.
- `src/routes/index.tsx`, `src/components/PageShell.tsx` — both headers reduced
  to **brand · navigation · one action**. The consultant button, the second
  (app) dropdown, the standalone language control and the three-line menu with
  its drawer are all gone, so the dropdown is the menu at every width. Section
  links (Businesses, Our approach, Live status) sit on the left of the gateway
  header with a clamp-based gap from the logo; the "Talk to us" action is pinned
  to the right. Page links are now localised instead of hardcoded English.
- `src/lib/i18n/dictionary.ts` — added `nav.menu` and `nav.onThisSite`; removed
  the retired `nav.consultant`, `nav.startProject`, `nav.openMenu`,
  `nav.closeMenu`, `nav.agency`, `nav.academy`, `home.hero.secondary`,
  `home.cta.primary`, `home.cta.secondary` and the `bento.ai.*` pair; rewrote
  `home.cta.body` so the closing call to action no longer advertises the
  consultant. English, French and Arabic stay in lockstep at **186 keys each**,
  in identical order.
- `src/components/ecosystem/WhyNdhBento.tsx` — the AI-consultant card is gone
  (the floating assistant already covers it), which also lets the bento fill its
  three-column grid exactly: one wide identity card plus four family cards, no
  empty cell.
- Deleted `src/components/ecosystem/AppSwitcher.tsx` and
  `src/components/ecosystem/LanguageMenu.tsx`; their content lives inside the
  single dropdown.

### Notes

- Nothing was removed from the consultant itself: the floating assistant button
  and the in-chat experience are unchanged. Only its promotion in the header is
  gone.
- The dropdown is the mobile menu as well — with the hamburger gone there is one
  menu to learn at every width, and every control keeps a 44px target.
- `gw-band-light` re-declares the light token set, so any section moved into that
  band inherits white surfaces without extra rules.

## Light-page correction — porcelain canvas, white content, two dark islands

Design review correction: the previous pass read as one continuous dark navy
page. NDH is a high-contrast alternating system — **only the hero banner and the
"idea behind NDH" card are dark**; everything below the hero is crisp light
porcelain or solid white. This pass replaces the dark-first layer with a
light-first one and applies the exact hex values from the correction.

### Changed

- `src/styles.css` — my earlier "v3" band layer was removed and replaced by a
  single **v4 light-first** layer (the top of the stylesheet, including the
  original token blocks, is untouched):
  - **Page (`.ecosystem-page` / `.gw-page`)**: background `#F1F4FA`, ink
    `#101B40`, muted `#4C5975`, lines `#D9E1EF`. Every `--gw-*` token now
    resolves to this light set, so components inherit it without extra rules.
  - **Header (`.ecosystem-header`)**: `rgba(255,255,255,0.85)` with
    `backdrop-filter: blur(12px)`, `border-bottom: 1px solid #D9E1EF`, brand and
    nav text `#101B40`.
  - **Hero (`.ecosystem-hero`, `.gw-band-hero`)**: the one dark banner —
    `radial-gradient(ellipse at 85% 55%, #13285C, #091B3F 72%)`, text `#F6F8FF`,
    kicker `#55D5FB`.
  - **Quick paths (`.ecosystem-paths`)**: solid `#FFFFFF`, `1px solid #D9E1EF`
    above and below, kicker `#3159C6`, links `#101B40` (hover `#3159C6`), items
    separated by `1px solid #D9E1EF` dividers instead of gaps — sidebar-style
    dividers that become horizontal on two rows and single column.
  - **Directory (`.ecosystem-directory`, `.ecosystem-card`)**: section
    `#F1F4FA`, heading `#101B40`, subtitle `#4C5975`; cards `#FFFFFF` with
    `1px solid #D9E1EF` and `0 10px 24px -18px rgba(16,27,64,0.12)`, titles
    `#101B40`, descriptions `#4C5975`, and a LIVE pill on `#ECFEFF` /
    `#CFFAFE` / `#0891B2` (`is-soon` pills stay amber). Filter chips, the
    "coming soon" tile and the empty state got matching light treatments.
  - **"Why NDH" and live status** are no longer dark: white bento cards on a
    white band, the status panel on white with `#F1F4FA` metric tiles and white
    country pills.
  - **"The idea behind NDH"**: an enclosed dark island — `#091B3F`, radius 24px,
    text `#F8FAFC` — sitting inside a white section, with its pillar tiles
    lifted to `rgba(248,250,252,0.06)`.
  - **Closing CTA and footer**: white card on porcelain, buttons cobalt
    (`#3159C6` → `#4F46E5`); footer `#FFFFFF` with a `1px solid #D9E1EF` top
    border and `#4C5975` text.
- Band rhythm on `/` is now declared as `gw-band-hero` (dark) then alternating
  `gw-band-white` / `gw-band-porcelain`: paths → directory → why → status →
  purpose → CTA, with the footer closing on white.
- `src/routes/index.tsx`, `src/components/ecosystem/EcosystemDirectory.tsx`,
  `WhyNdhBento.tsx`, `LiveStatusBar.tsx` — sections now carry the spec names
  (`.ecosystem-paths`, `.ecosystem-directory`, `.ecosystem-why`,
  `.ecosystem-status`, `.ecosystem-about`, `.ecosystem-cta`, `.ecosystem-card`)
  and status pills carry `is-live` / `is-soon`.
- Dead CSS for components that no longer exist (the app switcher, language menu,
  mobile drawer, header consultant button, `gw-panel-tools`, `menu-button`) was
  removed — 36 rules, ~670 lines — so no stale dark declarations remain for
  surfaces that are gone.

### Notes

- Dark declarations that remain in the stylesheet belong to exactly three
  places: the hero band, the purpose island, and unrelated app chrome (portal
  drawer/backdrops). Everything else resolves to the light palette.
- `.gw-band-white` / `.gw-band-porcelain` are the only two content bands, so a
  new section cannot accidentally inherit a dark background.

## NDH family pages — About, Journal, Contact and shared footer

- Replaced the agency-led About copy with the parent-brand story, all seven
  businesses (Travel / iHospital explicitly upcoming), shared principles and
  the Sokoto location.
- Added a reusable `FamilyPage` layout: the Open Gateway identity, a single
  language-aware menu, midnight hero and white/porcelain reading sections.
  Public family pages remain accessible to signed-in visitors as well.
- Rebuilt the Blog as the NDH Journal, with working topic filters, a featured
  story and three complete evergreen guides covering the family, school
  platforms and digital resources. Existing CMS and offline posts remain
  available. Article pages now include related reading and an outline for the
  new guides. Bundled covers replace unreliable external covers for seeded
  posts. No fabricated publication dates or company milestones were added.
- Rebuilt Contact with click-to-call, WhatsApp, general email and support email,
  a business/topic selector, accessible form labels and submission feedback.
  The existing server enquiry function remains in use; a failed request keeps
  the visitor’s message and offers direct email / WhatsApp alternatives.
- Centralised the supplied public details in `src/lib/site-contact.ts`:
  Marmaron Nufawa Western Bye Pass Sokoto, Nigeria; 09029932794;
  abunnajeeh7@gmail.com; support@ndh.com.ng. Google Maps opens an address search
  rather than claiming a verified pin or loading an embedded tracking map.
- Reused `FamilyFooter` on the homepage, new pages and legacy public PageShell:
  brand summary, family directory, About / Blog / Contact, live status, contact
  details, social links, Terms, Privacy, copyright and back-to-top.
- Rewrote the public Terms and Privacy pages for the parent gateway, rather
  than promoting certification or imposing portal-specific agreements. Portal
  legal components were not changed. These are content drafts for owner/legal
  review, not a compliance certification.
- Added the address and contact details to homepage Organization structured
  data. Expanded the homepage menu to include About and Blog.

### Verification

- `npx tsc --noEmit -p tsconfig.json`: clean.
- Targeted ESLint: clean; `git diff --check`: clean.
- `npm run build`: successful.
- `node scripts/check-family-pages.mjs`: nine public pages pass HTTP, shared
  footer, exact contact details, single h1 and single menu assertions.
- Playwright + temporary Chromium tooling (outside the repository): checked
  the homepage and five supporting pages at 320, 375, 768, 950 and 1440px; no
  document overflow and all contact/legal footer links present. Checked topic
  filters, loaded journal covers and mobile menu open / Escape close.
- Contact: empty form prevents submission; simulated network failure preserves
  message, re-enables Send and shows direct alternatives. Requests intercepted
  locally: no test enquiry or email was sent. Actual backend delivery still
  requires a configured live-service check.
- Browser-computed Contact bands are exactly white / #F1F4FA / white. Desktop
  About / Contact and mobile Journal were visually reviewed. Local browser
  console contains the development-only HMR WebSocket warning (the dev server
  expects the HTTPS preview on port 443), not an application render failure.

## Official subsidiary reference alignment (5 October 2026)

- Replaced the earlier speculative descriptions with owner-verified profiles in
  `business-profiles.ts`, consumed by English cards and the AI system brief.
  French/Arabic directory, categories, metrics, chat chips and footer summaries
  are aligned too.
- Academy: 60 courses, six exact specialized schools and their topic lists;
  restored signed/cryptographically-verifiable certificate information and
  `/verify` navigation. Kept the real 30-entry cached catalogue explicitly
  partial instead of fabricating the remaining courses.
- Venture renamed NDH AgriCapital with Sprout icon, cooperative farm-cycle
  investment model, contribution ledger, live equity, operator logs and
  proportional harvest profit distribution. Legacy name/AgriVest enquiries
  resolve to AgriCapital; generic startup fundraising does not.
- eStore now describes multivendor digital/physical storefronts, merchant
  onboarding, inventory, shipping, Paystack/Flutterwave checkout and payout
  ledgers, not a boilerplate-only shop.
- Agency: 10 departments, PM-mediated confidential isolation, QC, milestone
  verification and escrow payouts. Only the five confirmed department examples
  are listed; no invented department names.
- SchoolDesk, Travel and iHospital are all Coming Soon, across cards, menu,
  About, Contact, footer, journal, legal copy and consultant. No live launch
  links or promises of booking/onboarding are offered for pipeline businesses.
- Family snapshot uses verified scope counts [7, 4, 3, 60, 6, 10], replacing
  unsupported performance/uptime/network placeholders. JSON-LD uses actual
  names/descriptions and does not present pipeline URLs as active destinations.
- Supplied official domains used for Agency/Academy/eStore. AgriCapital keeps
  its existing legacy deployment link pending owner confirmation of a new
  domain. See `docs/official-business-profiles.md` for handoff decisions.
- Added repeatable profile/routing regression tests. 28 intent cases and
  additional assertions pass; SSR smoke checks, TypeScript, targeted ESLint and
  production build pass. Browser checks pass for EN/FR/AR at 375px and 1440px,
  including state counts, metrics, destinations and six Academy school cards.
- Fixed an RTL skip-link overflow revealed by the Arabic browser checks, and
  bounded the longer family dropdown to the viewport height.
