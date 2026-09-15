# Editorial work, testimonials, and blog redesign

## Direction locked

- Ocean Deep palette: `#0C2340`, `#1A4A6E`, `#2D8A9E`, `#5CBDB9`.
- Instrument Serif headings with Work Sans body text.
- Editorial high-contrast magazine composition: strong lead story, image-led supporting cards, fine rules, concise copy, restrained motion.
- Use initials when an authentic testimonial portrait is unavailable; do not invent client names, people, metrics, or project claims.

## What will change

### Work and case studies

- Replace the long stacked entries on `/work` with a featured case study and a balanced grid of compact image cards.
- Each card shows an image, category, client, title, short summary, and a clear “View case study” cue.
- Add `/work/:slug` pages for the full challenge, approach, result, and live-project link.
- Use genuine project images where already available; otherwise add clearly editorial category imagery rather than fake interface screenshots.
- Update Agency “Selected work” cards to open the matching case-study detail page.

### Client testimonials

- Redesign testimonials as polished quote cards with portrait/initial identity, name, role/title, organisation, and verification badge.
- Add optional testimonial image support to the content manager and public query.
- Preserve current placeholder identities until real names or portraits are provided.

### Blog

- Publish a small starter set of useful NDH articles with honest, practical content and relevant generated covers.
- Redesign `/blog` with one featured article and supporting image cards.
- Keep each card concise and open the existing dedicated article page for full reading.
- Improve article pages with editorial image, readable measure, metadata, and structured headings where present.

## Technical details

- Add a nested `/work/$slug` route and convert `/work` into a layout with `/work/` as its listing page, matching the existing blog route pattern.
- Add `getCaseStudy(slug)` and extend testimonial reads with the optional portrait field.
- Apply one additive migration for `testimonials.avatar_url` and literal, duplicate-safe blog inserts.
- Store generated images through the project asset flow and reference their CDN pointers.
- Update semantic colour and font tokens globally while keeping portal controls and existing functionality intact.
- Keep every route’s unique title, description, Open Graph title/description, type, and Twitter card metadata.

## Verification

- Check `/work`, every case-study detail route, `/agency`, `/blog`, and each starter article on phone portrait, phone landscape, tablet, and desktop.
- Confirm card text does not overflow, images crop consistently, all cards open correctly, and reduced-motion removes decorative movement.
- Confirm the latest build and browser console are clean.
