# Status check + full visual redesign

## What is already in place

- Auth with five roles (client, student, talent, pm, admin), signup role locked server-side to client/student, admin-only role changes.
- Database: profiles, roles, projects, tasks, courses, lessons, enrollments, talent profiles, invoices, escrow, plus the academy/invite tables added in the last pass. All RLS-gated, no dummy rows.
- Pages: Home, Agency, Academy, About, Contact, Terms, Privacy, Login, Signup, Talent application, Invite, and the five portals (admin, client, pm, student, talent).
- Build is clean.

## What is still missing

1. **Per-page SEO metadata** — no route defines its own `head()`. Every public page currently inherits the single root title "Najeeb Digital Hub", so search and link previews are identical everywhere.
2. **Contact form is not wired** — it renders but submits nowhere; no enquiries table, no confirmation state.
3. **Talent application page** submits into the database but there is no admin action behind the "Invite as Talent" button in the admin portal.
4. **Admin portal buttons are inert** — user search, PM invite generation, course editing all render without behaviour.
5. **Design system does not exist** — all styling is one hand-written 3-line CSS file using Georgia/Arial system fonts, with no semantic tokens. This is the main cause of the amateur look.

## The redesign (the main work)

### Design language
Move from the current beige/serif look to a confident, modern studio aesthetic:

- **Type**: Space Grotesk for display headings (tight tracking, large scale), Inter for body and UI. Loaded via the root route head.
- **Colour**: near-black ink on a soft off-white canvas, one decisive accent (deep electric blue) plus a muted secondary for surfaces. All values become semantic tokens in `src/styles.css` (`--background`, `--foreground`, `--primary`, `--muted`, `--border`, `--surface`, gradients and elevation shadows). No hardcoded colours in components.
- **Structure**: a real 12-column grid with generous vertical rhythm (128px section padding on desktop), asymmetric splits instead of centred blocks, and consistent 20px radii.

### Layout rebuild, page by page
- **Header/Footer**: slimmer sticky header with a subtle blur and a bottom hairline that only appears on scroll; a four-column footer (brand, company, legal, social) replacing the current single row.
- **Homepage**: full-height editorial hero with an oversized headline, an accent underline motif and a dual CTA; a stat/credibility strip; a three-card pillar row with hover lift and an accent line reveal; an asymmetric "for businesses" split; an academy teaser band; a closing CTA panel on a dark surface.
- **Agency**: sticky-side service navigation with a large service grid, numbered process rail with a connecting line, and a full-bleed CTA.
- **Academy**: masthead with the six schools as filter chips, then a denser, calmer course grid with number badges and hover states.
- **About / Contact**: two-column editorial layout; the founder photo gets a proper framed treatment rather than a bare image; the contact form is restyled with floating labels and clear focus rings.
- **Login / Signup**: centred card on a subtly patterned canvas, logo lockup, clear error/success states.
- **Portals**: shared shell treatment — consistent page head, card elevation, stat tiles, status pills and empty states so all five portals look like one product.

### Motion and effects
- A single scroll-reveal primitive (fade + 16px rise, staggered per grid) applied consistently, replacing the current ad-hoc one.
- Hover: cards lift with a soft shadow and reveal an accent line; buttons get a subtle press state; links get an animated underline.
- Hero: a slow ambient gradient/grain layer behind the headline, plus a gentle parallax on the hero image.
- Page transitions: short cross-fade between routes.
- All motion respects `prefers-reduced-motion` (already partially handled; will be kept complete).

### Technical notes
- `src/styles.css` is rewritten as a proper token layer (`@theme` variables) plus component classes, with readable formatting instead of the current minified single lines.
- Components stay in plain CSS classes driven by tokens; existing shadcn primitives are available where a real widget is needed.
- Fonts are loaded with `<link>` tags in `src/routes/__root.tsx` (not `@import`).
- Per-page `head()` metadata is added to every public route as part of this pass.

### Order of work
1. Token layer + fonts + header/footer.
2. Homepage.
3. Agency, Academy.
4. About, Contact, legal pages.
5. Login/Signup.
6. Portals consistency pass.
7. SEO metadata + final build check.

Wiring the contact form, admin invites and the other inert buttons is listed above as remaining, but is functional work — say the word and I will fold it in after the visual pass.
