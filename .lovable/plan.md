# Premium light redesign — whole site

## Locked direction

- **Palette (your pick):** pure white canvas `#ffffff`, soft grey surface `#f5f6f8`, near-black ink `#0b1220`, one decisive blue accent `#1d4ed8`. Light only — no dark theme anywhere.
- **Type (my recommendation):** Space Grotesk for display headings, Inter for body and UI. Space Grotesk gives the headlines a confident, modern-marketplace character; Inter keeps dense portal UI perfectly legible. Georgia/Arial go away entirely.
- **Layout (my recommendation):** asymmetric split hero, then full-width alternating bands. It reads as expensive and calm rather than busy, works on a 393px phone without collapsing into a long scroll, and gives every page the same rhythm.

## What changes

### 1. Real design system
`src/styles.css` is currently one minified, hand-written file with no token layer — that is the root cause of the cheap look. It gets rewritten as a readable Tailwind v4 token layer:

- `@theme` tokens for colour, radii, shadows, spacing scale.
- One elevation scale (hairline / soft / lifted) instead of ad-hoc box-shadows.
- One 8pt spacing rhythm: 96px section padding desktop, 56px mobile.
- Radii: 14px cards, 999px pills.
- Focus rings, selection colour, and a consistent hairline border token.
- No hardcoded colours left in any component.

### 2. Chrome
- **Header:** slim sticky bar, white with blur, hairline appears only on scroll. Logo, four links, one blue "Get started" pill. Mobile keeps the pill next to the menu icon.
- **Footer:** compact four-column grid (brand, explore, company, social) with a thin legal base row. Stays side-by-side on mobile.

### 3. Public pages
- **Home:** oversized split hero with accent-underlined headline and real photo; trust strip; three-pillar row with hover lift and an accent line reveal; asymmetric "for businesses" split; academy teaser band on the soft grey surface; closing CTA panel.
- **Agency:** service grid with numbered process rail and a connecting line, full-bleed CTA.
- **Academy:** masthead with the six AI Schools as filter chips, then a calm course grid with number badges and price pills.
- **About / Contact:** two-column editorial layout; contact form restyled with proper labels, focus rings and clear states.
- **Terms / Privacy:** narrow readable prose column, 68ch measure.
- **Login / Signup / Invite / Talent application:** centred white card on the soft grey canvas, logo lockup, clear error and success states.

### 4. Portals (this is where the site currently looks most unfinished)
All five portals (admin, client, pm, student, talent) plus the learning, exam and certificate pages get one shared shell treatment:

- Consistent page head (eyebrow + title + one-line description).
- Stat tiles, status pills, progress bars and empty states drawn from the same tokens.
- Card elevation and grid rules identical across portals so they read as one product.
- Several of these route files are written as single minified lines; they get reformatted while restyling so they stay maintainable.

### 5. Motion
- One scroll-reveal primitive (fade + 16px rise, staggered per grid).
- Card hover: 4px lift, soft shadow, accent line.
- Button press state, animated link underline.
- Everything respects `prefers-reduced-motion`.

## Technical notes

- Tailwind v4: tokens in `src/styles.css` under `@theme` / `@theme inline`; custom utilities via `@utility`. No `tailwind.config.js`.
- Fonts loaded with `<link>` in `src/routes/__root.tsx` (already partly wired) — never `@import` in CSS.
- Purely presentational: no database, RLS, auth or server-function changes.

## Order of work

1. Token layer + fonts + header/footer
2. Homepage
3. Agency + Academy
4. About, Contact, legal
5. Auth and invite pages
6. Portal consistency pass
7. Build check + mobile screenshot verification

## Still remaining after this (not design work)

These are the functional gaps I found in the current project — tell me if you want them folded in:

1. **Contact form is not wired** — it renders but submits nowhere. Needs an enquiries table and a confirmation state.
2. **Admin portal actions are inert** — user search, PM invite generation and "Invite as Talent" render but do nothing.
3. **No `/blog` route** exists, though the footer and earlier plans reference it.
4. **Branded auth emails** — signup/reset emails are still the default templates on `notify.ndh.com.ng`.
5. **Payments end-to-end** — Paystack keys are set and the webhook route exists, but the enrol-and-pay path has not been tested live.
6. **Academy certification loop** — AI exam generation and grading are wired, but the Director certification queue still needs a review UI.
