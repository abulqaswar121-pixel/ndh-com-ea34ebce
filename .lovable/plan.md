# Design polish — tighter cards, smoother motion, horizontal rails

Presentation only. No content, data, auth or payment changes.

## 1. Cards get smaller and more even

Right now several cards grow tall because the text inside them varies in length, so rows look ragged.

- Trim card padding (26px to 18-20px) and reduce minimum heights so a short card no longer sits in a tall empty box.
- Clamp descriptions to 2 lines on service, pillar, course, case-study and testimonial cards, with a gentle fade, so every card in a row ends at the same height.
- Smaller icon-to-title spacing (22px to 12px) and slightly tighter type sizes on mobile.
- Case study cards: shrink the image column, cap challenge/approach/result text to short previews rather than full paragraphs.
- Testimonial quotes clamp to 4 lines.

## 2. Horizontal scrolling sections

Turn selected grids into swipeable rails — a single row of cards you drag or scroll sideways, with snap so each card lands neatly:

- Home: the three pillars and the academy teaser courses.
- Agency: service areas, the four process steps, "Selected work", and the testimonials.
- Academy: the course grid becomes a rail per section on phones, staying a grid on desktop.
- Student portal catalogue keeps its grid (it needs search and filtering), but the dashboard rows become rails.

Each rail: edge-to-edge on phones, hidden scrollbar, snap points, soft fade at the right edge hinting more content, and arrow buttons on desktop. Full keyboard and trackpad support.

## 3. Smoother motion

- One shared easing curve and slightly longer, softer hover lift (currently a fairly abrupt 4px jump).
- Cards fade and rise in sequence as a row enters view, instead of all at once.
- Press/tap feedback on cards and buttons.
- Rails animate their scroll rather than jumping.
- Everything switches off under reduced-motion settings.

## 4. General tidy while passing through

- Consistent corner radius and shadow depth across every card type (some still use one-off values).
- Section spacing rhythm evened out between public pages.
- Tag and badge pills made smaller so they don't dominate small cards.

## Technical notes

- All work in `src/styles.css` plus small markup wrappers on the affected route files (`index.tsx`, `agency.index.tsx`, `academy.index.tsx`, `work.tsx`, student portal dashboard).
- New reusable `.rail` utility (scroll-snap + fade mask + arrow controls) as a small React component so every section behaves identically.
- Line clamping via CSS `-webkit-line-clamp`; no JS truncation.
- Verified afterwards with screenshots at phone width, the current 550px window, and desktop.
