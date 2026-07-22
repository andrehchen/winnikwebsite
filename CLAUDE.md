# Winnik Group site — build rules

- Strict black-and-white palette only. Ink #0A0A0A, paper #FFFFFF,
  band #F5F4F2, mute text #6B6B6B, hairline #E4E4E4. No accent color.
- Fonts: Archivo (display), Inter (body), Source Code Pro (labels,
  formulas, emails, citations).
- Signature motif: polymer repeat-unit brackets + subscript n for the
  wordmark; fine hairline SVG skeletal structures as section markers only.
- Member photos rendered grayscale via CSS filter.
- No emojis anywhere. No gradients, drop shadows, or glow.
- Motion minimal: subtle fade-in on scroll and quiet hover only.
  Respect prefers-reduced-motion.
- Responsive to mobile, visible focus states, sentence case.
- Preserve all research descriptions and member details verbatim (see BRIEF.md).
- Reference sites are gathered by URL, not screenshot: fetch each URL the
  user provides, write a specific description of what to borrow (layout,
  type pairing, spacing, motion) to a .md file in /references, and use
  those descriptions as concrete targets.
- No Playwright screenshotting. After each build pass, run the local dev
  server, tell the user precisely what changed and what to check in their
  own browser, and wait for their approval or specific feedback before
  moving on.
- Interactive canvas/animation scenes (e.g. the Research page's molecular
  scenes) must pause their animation loop via IntersectionObserver when
  scrolled out of view — never run requestAnimationFrame forever regardless
  of visibility.
- Custom scroll-paging (research.html) must never change page from residual
  scroll momentum — a page change only commits on genuine input at the
  actual section boundary, and opposing input is ignored while a scroll
  transition is still settling.
- Before building a chemistry-themed interactive/visual element, sanity-check
  its scientific accuracy explicitly with the user rather than assuming —
  design it to match how the real chemistry actually behaves.
- Standalone experimental/prototype HTML files live in /prototypes, not the
  project root.
- Compress large images before committing (e.g. via `sips`), and confirm a
  new image asset is actually referenced by a page before adding it to the
  repo.
