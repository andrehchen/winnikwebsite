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
