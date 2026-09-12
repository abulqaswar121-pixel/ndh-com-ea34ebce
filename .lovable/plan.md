# Selective scrolling, cleaner content layouts, and relevant imagery

Presentation only. Keep all existing content, links, data, authentication, and payment behavior unchanged.

## 1. Undo the over-applied horizontal layouts

- Return **Services** on `/agency` to a normal responsive vertical grid/list.
- Keep **Academy courses** as a normal responsive grid on phones and larger screens, including the student catalogue.
- Keep **Selected Work / case studies** in a vertical editorial layout on both `/agency` and `/work`.
- Return the homepage pillar cards to a simple responsive grid rather than a scrolling rail.
- Remove unnecessary carousel arrows, fade masks, and square-card sizing from these core browsing sections.

## 2. Keep horizontal movement only where it helps

- Use a compact horizontal sequence for **How We Work**.
- Use a horizontal quote rail for **Testimonials**.
- Give these two sections swipe/trackpad support, snap points, and clear previous/next controls.
- Add gentle automatic advancement only when the section is visible; pause it on hover, focus, touch, or manual interaction.
- Stop automatic movement for reduced-motion users and keep every item keyboard accessible.

## 3. Make cards fit their purpose

- Services become clean rectangular entries with restrained borders, shorter spacing, and no decorative corner arrow dominating each item.
- Process steps become compact landscape cards, not large squares.
- Testimonials become quote-led panels sized by readable line length rather than fixed square boxes.
- Courses remain scannable catalogue cards with natural content height.
- Case studies become image-and-text editorial rows/cards with more breathing room for project details; they will not be horizontally clipped or truncated like secondary cards.
- Keep subtle reveal, hover, and press transitions without making every section move.

## 4. Add more relevant pictures

- Add a small, cohesive set of professional visuals where imagery improves understanding: the Agency introduction/service context, Academy learning context, and Selected Work.
- For real projects, use genuine available project imagery or live-project previews where suitable; do not invent fake product screenshots or fake results.
- Where no authentic project image exists, use a clearly editorial, category-relevant visual rather than pretending it is the delivered interface.
- Keep imagery bright, clear, professionally composed, and consistent with NDH’s existing light visual identity.
- Optimize each new image for mobile and desktop loading, with descriptive alternative text.

## 5. Responsive and visual verification

- Check the homepage, `/agency`, `/academy`, `/work`, and the student catalogue at phone portrait, phone landscape, tablet, and desktop sizes.
- Confirm vertical sections remain easy to scan, the two horizontal sections do not trap page scrolling, controls do not overlap text, and images crop cleanly.
- Verify reduced-motion behavior, keyboard navigation, and the latest build before completion.

## Technical details

- Narrow the reusable rail usage to process and testimonial content only.
- Extend the rail with optional autoplay rather than enabling it globally.
- Use existing design tokens and shared image handling; no unrelated redesign or content rewrite.
