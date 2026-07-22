# Winnik Group Website — Build Brief

A complete spec for rebuilding the Mitchell Winnik Research Group site
(`winnikgroup.chem.utoronto.ca`) as a sleek, minimalist black-and-white
site themed around polymer chemistry and molecular structure.

Hand this file to Claude Code and it has everything it needs: the design
system, all the real content to preserve, every image URL, and the build
process. Nothing here needs to be re-fetched from the live site.

---

## How to use this file

1. Create a new project folder and drop this file in as `BRIEF.md`.
2. Create a `CLAUDE.md` (the rules-file section below is ready to paste in).
3. Open Claude Code in the folder and start with the kickoff prompt at the
   bottom (§9).
4. Before building, gather **reference URLs** instead of screenshots: send
   Claude Code links to lab/portfolio sites whose look you admire. Claude Code
   fetches each one, writes a specific description of what to borrow (layout,
   type pairing, spacing rhythm, motion — not just "looks nice"), and saves
   that description as a `.md` file in `/references`. This is the single
   biggest lever on final quality — it gives the model a concrete target
   instead of its "average" default.

### How review works in this project

No screenshot tool is used here. Instead, Claude Code runs a local dev server
and you open the actual page in your own browser to review each change live.
After each build pass, Claude Code tells you exactly what changed and what to
look at (e.g. "check the hero at mobile width, and hover the nav links") so
you can approve or send back specific feedback.

### Add-ons worth wiring into Claude Code first

- **Context7 MCP** — pulls current, version-pinned framework docs so the agent
  doesn't write against outdated APIs.
- **shadcn/ui** — only if you go the React/Next route (see §3). Skip for a
  plain static build.

Keep the MCP set small. More servers = more token overhead and a slower,
dumber agent.

---

## 1. Project goal

Upgrade the existing Winnik Group site. Same content and identity, dramatically
better execution.

**Hard requirements (from the group):**
- Professional and sleek. No distracting visuals, no gratuitous animation, no emojis.
- Strict black-and-white / minimalist theme.
- Polymer chemistry and molecular formulas as the visual theme.
- Preserve the group logo/wordmark.
- Reuse the existing group and member photos.
- Preserve the research descriptions (verbatim — see §6).

**Audience:** prospective grad students and postdocs, academic collaborators,
funding bodies, peers. **The page's job:** convey the group's research identity
with credibility and make research / people / contact easy to find.

---

## 2. Design system (the plan)

The whole point of writing this down is to inject specificity *before* any code
exists. Every color and type decision below is deliberate — derive the build
from it exactly, don't improvise new ones.

### Palette — strictly monochrome

| Token        | Hex       | Use                                   |
|--------------|-----------|---------------------------------------|
| `--ink`      | `#0A0A0A` | Primary text, structures (near-black) |
| `--paper`    | `#FFFFFF` | Page background                       |
| `--paper-2`  | `#F5F4F2` | Alternating section bands             |
| `--mute`     | `#6B6B6B` | Secondary text, captions              |
| `--hairline` | `#E4E4E4` | Rules, borders, dividers              |

No accent color at all. The deliberate aesthetic risk: **chemistry is the only
ornament.** Do not add a blue/teal/etc. accent "for interest" — the molecular
linework is the interest.

### Typography

Three roles (decided, after comparing candidates live against the
references):
- **Display** — **Archivo**. A formal, institutional grotesque — more
  professional and less startup-casual than a typical geometric grotesk.
- **Body** — a clean humanist sans. **Inter**.
- **Utility/mono** — **Source Code Pro**. This is the subject-specific move:
  chemical formulas, member emails, figure/section labels, and citation keys
  all get set in mono so notation reads as *native* to the page, not bolted on.

Set a clear type scale with intentional weights. Large, confident display sizes;
generous line-height on body (~1.6–1.7). Sentence case throughout — no ALL CAPS
headers except where used as a deliberate mono "label" device at small sizes.

### Signature element — the polymer repeat unit

This is the one memorable idea that makes the site unmistakably *this* lab:

- **Logo/wordmark** becomes a polymer bracket-*n* lockup: `⟦ Winnik Group ⟧ₙ`
  (repeat-unit brackets with a subscript *n*). This is the "logo" to preserve —
  the current site uses a plain text wordmark, so unless the group hands you an
  actual logo image file, render this typographic lockup as the mark. If they
  do have a logo asset, drop it in and use it instead.
- **Section markers** are hairline skeletal structures of the actual molecules
  the group works on (metal-chelating polymer repeat units, silica networks,
  cellulose nanocrystal rods), drawn as fine SVG line art in `--ink` on `--paper`.
  Keep stroke weights thin (0.5–1px) and use them sparingly as eyebrows/dividers,
  not wallpaper.
- **Member photos** unified to grayscale. Converting the mismatched existing
  photos to a consistent black-and-white treatment is what makes "reuse the same
  photos" look intentional rather than inherited. Apply with a CSS `filter:
  grayscale(1)` (optionally a subtle contrast bump) so the originals stay intact.

### Layout

- Slim **sticky top nav**: bracket-*n* wordmark left, section links right.
- **Hero** leads with a large hairline polymer-chain / molecular structure and
  the group's one-line thesis — *not* the lab photo front-and-center. The hero
  is the thesis; open with the most characteristic thing in the subject's world.
- **Research** as clean editorial rows (image + heading + description), one area
  per row, alternating image side, mono eyebrow label per area (e.g.
  `01 / MASS CYTOMETRY`).
- **People**: PI featured (photo + bio), then a grayscale photo grid of members
  (name, role, email in mono).
- **Publications**: mono reference style (see §6).
- **Contact**: quiet block — email, room, building address.
- **Footer**: UofT / Department of Chemistry affiliation + social links.

### Motion & accessibility (quality floor)

- Motion is minimal and subtle: at most gentle scroll-reveal fades and quiet
  hover states. No parallax, no bouncing, no autoplay. Respect
  `prefers-reduced-motion`.
- Fully responsive down to mobile. Visible keyboard focus states. Sufficient
  contrast (easy here — it's black on white).

---

## 3. Tech stack

The site is content-first and static. Two good options:

- **Plain HTML + CSS** (+ a touch of vanilla JS for the mobile nav and
  scroll-reveal). Simplest to build, simplest to host, no build step. Recommended
  if you want minimal moving parts.
- **Astro** — if you'd like components and clean templating while still shipping
  static HTML. Good middle ground; content collections suit the research/people lists.

Avoid a heavy SPA framework — it buys nothing for a brochure site and complicates
hosting.

**Hosting note:** the current site runs on **Grav CMS** (the `/user/pages/...`
image paths are the tell), hosted on the department's `chem.utoronto.ca`
infrastructure. Confirm with the department how the new site will be deployed
before committing to a stack — you may need to either (a) produce a static build
they can drop in, or (b) re-theme within Grav. Build the static version first
regardless; it's the fastest path to something you can show people.

**Image assets:** the existing images live on the current server (URLs in §7).
For the build you can either reference those absolute URLs directly, or download
them into a local `/assets` folder and re-host. Downloading is more robust for a
deployed site; referencing is fine for fast prototyping.

---

## 4. CLAUDE.md rules file (paste into your repo)

```md
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
```

---

## 5. Site structure

Multi-page (decided — see §10). Nav / pages:

`Home` · `Research` · `People` · `Publications` · `Contact`

`Home` is a landing page: hero (hairline molecular structure + thesis line),
then a short summary/overview card per section below it — each card links out
to its own dedicated page for the full content. The full research
descriptions, full people bios/grid, and full publications list each live on
their own page, not on Home.

(The current site also has a `News` page. Optional — include a minimal news/updates
section only if the group has content to fill it.)

---

## 6. Content inventory — preserve verbatim

### Home / intro

**Winnik Group** — *The Polymer and Colloids Group*

> The Winnik group studies a broad spectrum of topics in the general areas of
> polymer science, self-assembly, and nanochemistry. We like problems that
> require a combination of synthesis and physical measurements. Students and
> Postdocs in the group come from different backgrounds and have different areas
> of expertise (polymer chemistry, organic chemistry, physical chemistry, colloid
> science, chemical engineering, physics). We are fond of projects that require
> individuals with different backgrounds to work together.

> Professor Winnik began his research career and obtained tenure as an organic
> chemist. His transformation into a polymer chemist, which began in the late
> 1970s, taught him that a change of field or a change of research topic can lead
> to growth in creativity. From time to time, new opportunities present themselves,
> which take the Winnik Group into new areas.

### Research areas (5)

**01 — Mass Cytometry**
> Mass cytometry is a high-throughput multiparameter bioanalytical technique for
> studying biomarker expression on individual cells. Antibodies or other reagents
> are used to label the cells with isotopes of heavy atoms (mass tags) that can
> then be detected by atomic mass spectrometry with single mass resolution. In
> suspension mass cytometry (SMC), cells and mass tags are vaporized, atomized and
> ionized to create an ion cloud that enters the time-of-flight detection. They are
> then separated by their mass-to-charge ratio. In imaging mass cytometry (IMC™), a
> laser is used to ablate small (~1 µm²) regions of a tissue section so that the
> plume is carried into the plasma torch of the MC instrument. By rastering the
> sample, an image of biomarker distribution in the tissue sample can be created.
> We aim to design versatile mass tags that can enable simultaneous detection of
> multiple biomarkers that will give sensitive signals from MC.

**02 — Metal-Chelating Polymers (MCPs)**
> Metal-chelating polymers are polymers with repeating chelator pendant groups that
> can carry metal isotopes. The polymer also contains functional group to conjugate
> to antibodies. MCPs have previously shown to effectively differentiate biomarkers
> on mass cytometry.

**03 — Mesoporous Silica Nanoparticles (MSNs)**
> Mesoporous silica nanoparticles (MSNs), composed of silica, are a promising
> material for mass tags. Their large surface area allows an efficient metal loading
> for higher signal intensity, while the abundance of silanol groups on the surface
> of MSNs allows various chemical modifications (e.g., polymer grafting) and Ab
> conjugation.

**04 — Polymer Chemistry in Latex Films**
> For more than 20 years, we have worked with scientists in the coatings industry to
> help them prepare waterborne coatings that are environmentally compliant with high
> performance. We developed methods based on fluorescence resonance energy transfer
> (FRET) to study polymer diffusion across interfaces in latex films. In this way, we
> were able to develop an understanding of how various additives or chemical properties
> affect film formation. Since 2014, we have been working closely with scientists at
> BASF to study the mechanistic aspects of novel coating formulations developed in
> company laboratories.

**05 — Rod-like Nanoparticles and Cellulose Nanocrystals (CNCs)**
> Elongated colloidal nanoparticles have significant potential for drug delivery and
> imaging in cancer therapy. Cellulose nanocrystals (CNCs) are biocompatible, rodlike
> colloids that are broadly surface-functionalizable, making them interesting as
> modular drug carriers. We are investigating the surface modification of the CNCs
> with various polymers and their versatile applications.

### People

**Principal Investigator — Mitch Winnik**
Email: m.winnik@utoronto.ca · Phone: (416) 978-6495 · Room: LM520

> Mitch Winnik received a B.A. degree from Yale University in 1965. He obtained his
> Ph.D. degree in the area of organic chemistry at Columbia University in 1969,
> working under the direction of Prof. Ronald Breslow, and then spent a year as a
> postdoctoral fellow in the laboratory of Prof. George Hammond at Caltech studying
> organic photochemistry. He joined the faculty at the University of Toronto in 1970,
> and received tenure as an organic chemist. After his first sabbatical, in Bordeaux
> France, he decided that it was time to change directions and begin work on polymers
> in solution. He and his coworkers prepared a series of polymers with a pyrene group
> at both ends. The pyrene groups emit a blue fluorescence if the pyrenes are far
> apart, but if an excited pyrene during its lifetime can find a second pyrene, they
> form a sandwich structure which emits a green "excimer" fluorescence. In dilute
> solution, the rate of excimer formation from the end-labeled polymers measures the
> end-to-end cyclization rate of the polymer chain. For many years, the Winnik group
> used pyrene fluorescence as a probe of polymer dynamics in solution. In the early
> 1980's, the Winnik group broadened its interests to encompass polymers as materials.
> They first looked at polymer particles that formed stable colloidal dispersions
> (non-aqueous dispersions) in hydrocarbon media and then later turned their attention
> to latex nanoparticles prepared by emulsion polymerization. Working initially with
> postdoc Cheng-Le Zhao (now at BASF), he developed fluorescence resonance energy
> transfer (FRET) methods to study polymer diffusion in latex films. In this way, the
> Winnik group began a 20 year+ collaboration with various companies on the coatings
> area. In 1998, we began a collaboration with Ian Manners on the self-assembly of
> polyferrocenylsilane block copolymers in solution. Through these efforts they
> discovered crystallization-driven self-assembly (CDSA) leading to novel low-curvature
> structures. They developed concepts of seeded growth and self-seeding that enabled
> the generation of a broad range of uniform colloidally stable structures. CDSA has
> become its own defined area of polymer research. More recently, we became interested
> in rod-like nanoparticles as potential drug/radioisotope delivery agents for cancer
> therapeutics, and in mass cytometry — a technique invented at the University of
> Toronto. Mitch Winnik was approached along with Mark Nitz with the idea of
> synthesizing metal-chelating polymers to bind lanthanide isotopes; working together,
> they developed the polymers now sold as Maxpar reagents. Work continues in the Winnik
> and Nitz group to provide new reagents to expand the scope of this technique. The
> group welcomes students with chemistry, physics, biology, and/or chemical engineering
> backgrounds.

*(Bio is long — condense to 2–3 paragraphs on the site if it reads heavy, but keep
the full version available. Don't invent new claims.)*

**Group members**

| Name                   | Role                              | Email                          |
|------------------------|-----------------------------------|--------------------------------|
| Andy (Xu) Chen         | Chemistry PhD Student             | andyxu.chen@mail.utoronto.ca   |
| Rojina Allamehnejad    | Chemical Engineering PhD Student  | rojina.allamehnejad@mail.utoronto.ca |
| Richard Fuku           | Chemistry PhD Candidate           | richard.fuku@mail.utoronto.ca  |
| Seoyeon (Julia) Lee    | Chemistry PhD Student             | seoyeonjulia.lee@mail.utoronto.ca |
| Tianjia Yang           | Chemistry PhD Candidate           | tianjia.yang@mail.utoronto.ca  |
| Xiaochong (Summer) Li  | Postdoctoral Fellow               | xiaochong.li@mail.utoronto.ca  |
| Owen Chun Ho Kwok      | Chemistry PhD Candidate           | owen.kwok@mail.utoronto.ca     |
| Franklin Frasca        | Postdoctoral Fellow               | franklin.frasca@utoronto.ca    |

*(Franklin Frasca has no photo on the current site — use a consistent placeholder
in the grayscale style, or omit the photo slot gracefully.)*

### Publications

The current site keeps a full publication list at
`https://winnikgroup.chem.utoronto.ca/publications`. Port that list into a clean
mono-styled reference format. Example of the existing citation style to match:

> Zhang, Y.; Liu, P.; Majonis, D.; Winnik, M. A. Polymeric Dipicolylamine-Based Mass
> Tags for Mass Cytometry. *Chem. Sci.* **2022**, *13*, 3233–3243.

Have Claude Code fetch the live publications page and reproduce the full list; keep
DOI links where present. Consider grouping by year (newest first).

### Contact

> For more information about the lab, please contact Professor Mitch Winnik.
> m.winnik@utoronto.ca
> LM 520 — Lash Miller Chemical Laboratories, 80 St. George Street, Toronto, ON, M5S 3H6

### Footer / affiliations

- Department of Chemistry — https://www.chemistry.utoronto.ca/
- University of Toronto — https://www.utoronto.ca/
- Socials (department): twitter.com/chemuoft · instagram.com/chemgraduoft ·
  youtube.com/channel/UCjKseW2IpKN8dShP5mu6YSw · linkedin.com/groups/8463858
- © Department of Chemistry, Faculty of Arts & Science, University of Toronto

---

## 7. Image assets (existing URLs)

| Asset            | URL                                                                                          |
|------------------|----------------------------------------------------------------------------------------------|
| Lab / hero photo | https://winnikgroup.chem.utoronto.ca/user/pages/images/labpic.jpg                            |
| Mass cytometry   | https://winnikgroup.chem.utoronto.ca/user/pages/02.research/images_large_cr2c00350_0002.jpeg |
| MCPs             | https://winnikgroup.chem.utoronto.ca/user/pages/02.research/images_large_bm4c00937_0001.jpeg |
| MSNs             | https://winnikgroup.chem.utoronto.ca/user/pages/02.research/images_large_cm4c00573_0010.jpeg |
| Latex films      | https://winnikgroup.chem.utoronto.ca/user/pages/02.research/BASF%20project.png               |
| CNCs             | https://winnikgroup.chem.utoronto.ca/user/pages/02.research/images_large_bm5c01194_0006.jpeg |
| Winnik (PI)      | https://winnikgroup.chem.utoronto.ca/user/pages/03.group-members/winnik.png                  |
| Andy Chen        | https://winnikgroup.chem.utoronto.ca/user/pages/03.group-members/andy-3.jpg                  |
| Rojina           | https://winnikgroup.chem.utoronto.ca/user/pages/03.group-members/rojina-3.jpg                |
| Richard Fuku     | https://winnikgroup.chem.utoronto.ca/user/pages/03.group-members/richard-2.jpg              |
| Julia Lee        | https://winnikgroup.chem.utoronto.ca/user/pages/03.group-members/julia-2.jpg                 |
| Tianjia Yang     | https://winnikgroup.chem.utoronto.ca/user/pages/03.group-members/tianjia-3.jpg              |
| Summer Li        | https://winnikgroup.chem.utoronto.ca/user/pages/03.group-members/xiaochong-2.jpg            |
| Owen Kwok        | https://winnikgroup.chem.utoronto.ca/user/pages/03.group-members/owen-2.jpg                  |

Verify each URL resolves when you build; a couple of the member filenames follow a
`name-N` pattern and may have been updated on the live site.

---

## 8. Build order & iteration loop

1. Scaffold the project + design tokens (CSS variables from §2). Load the three
   fonts. Get the palette and type scale right before any layout.
2. Build the sticky nav + bracket-*n* wordmark.
3. Build the hero with the hairline molecular motif and thesis line.
4. Build one research row, get it perfect, then repeat for all five.
5. Build the people section (PI feature + grayscale member grid).
6. Publications (fetch live list) + contact + footer.
7. Responsive pass (mobile nav, stacking, image sizing).
8. **The loop, every pass:** Claude Code runs the local dev server, states exactly
   what changed and what to check (e.g. "hero heading is now ~72px, check it at
   mobile width too"), and you review it live in your own browser at
   `http://localhost:<port>`. Reply with specific feedback ("increase hero heading
   to ~72px", "tighten section padding", "member photos need consistent aspect
   ratio") and Claude Code fixes issues one at a time. Precise feedback beats
   "make it nicer" — vague notes make the agent thrash.

**Watch for these AI-slop tells and prompt them away if they appear:** any color
creeping in, generic three-card feature rows, evenly-mathematical spacing with no
rhythm, all-same-weight text, emoji, drop shadows, decorative gradients.

---

## 9. Kickoff prompt for Claude Code

> Read BRIEF.md and CLAUDE.md in this repo. We're rebuilding the Winnik Group lab
> website as a minimalist black-and-white site themed around polymer chemistry and
> molecular structure. Start by setting up the project structure and the design
> tokens (palette + fonts + type scale) from the brief — show me just the tokens and
> a type specimen first so we can lock the foundation before building sections. Use
> plain HTML/CSS unless I say otherwise. Don't add any color, emojis, or heavy
> animation. After we approve the foundation, we'll build section by section: you
> run a local dev server after each pass, tell me exactly what changed and what to
> check, and I'll review it live in my own browser before we move on.

---

## 10. Open decisions to make as you go

- **Logo:** no separate logo image was found on the current site (it uses a text
  wordmark), so the bracket-*n* typographic lockup is the default mark. If the group
  has an actual logo file, use it instead.
- **Single-page vs multi-page:** decided — multi-page. Home is a landing page:
  a full-height hero, then one full scroll section per area (not cards),
  each with its own bordered button linking out to a dedicated page. Nav
  links point to real pages, not in-page anchors.
- **People split:** decided — split into two pages. `winnik.html` for Mitch
  Winnik (PI) and `people.html` for the rest of the group. Both have their
  own nav entry and their own Home section/button.
- **Photo treatment:** grayscale-unified is recommended for cohesion, but confirm the
  group is happy losing the original color.
- **News section:** include only if there's content to sustain it.
- **Hosting:** confirm the Grav-vs-static deployment path with the department early.

---

## 11. Current build status (last updated 2026-07-22)

### Done

- **Design tokens locked** (`css/tokens.css`, `css/site.css`, `css/style.css`,
  `css/base.css`): palette (ink/paper/paper-2/mute/hairline), type scale,
  spacing scale. Fonts finalized after live comparison: **Archivo** (display),
  **Inter** (body), **Source Code Pro** (mono, incl. weight 600 for
  publication titles). Specimen page preserved at `foundation.html` (not
  linked in nav).
- **References gathered** (`/references`, 6 files): Matter Lab (primary),
  Li Bowen team page, BBML/Miserez, Wheeler microfluidics, a minimal-portfolio
  landbook reference, and a Siteinspire (Angela Ricciardi) reference — each
  with specific notes on what to borrow vs. avoid, not screenshots.
- **Site structure**: ten pages. `index.html`, `research.html`,
  `winnik.html`, `people.html`, `publications.html`, `contact.html`,
  `foundation.html` (unlinked type specimen), plus three deep-dive stub
  pages reached from Research's "learn more" links —
  `mass-cytometry.html`, `films.html`, `cncs.html`.
- **Sticky nav**: bracket-*n* wordmark (`⟦ Winnik Group ⟧ₙ`) left, links
  right, active-page underline via `aria-current="page"`, mobile hamburger
  below 640px, visible focus states.
- **Home page (`index.html`)**: full-height hero + section-preview blocks
  linking out to each page.
- **Research page (`research.html`)** — the most built-out page, now a
  full custom scroll-paging experience rather than a plain scrolling page:
  - JS-driven "one section per scroll" paging with rubber-band resistance,
    a momentum-decay heuristic so a decaying trackpad/wheel tail never
    triggers a page change (only a genuine input at the actual section
    boundary does), and a unified settling/waitForArrival state machine so
    opposing input mid-transition can't leave the scroll stuck.
  - **Mass Cytometry section**: an interactive canvas scene (mesoporous
    silica nanoparticle stand-in) with a draggable/hoverable lanthanide
    ring; pauses its animation loop via `IntersectionObserver` when
    scrolled out of view.
  - **Latex Films section**: an interactive core-shell latex particle
    canvas scene — particles diffuse slowly in solution; clicking one
    cures the batch, growing hexagonal shell outlines and interlink
    "bridges" between neighboring particles that propagate outward
    (BFS hop-delay) from the clicked particle; clicking again reverses it.
    Full-bleed canvas, transparent background, and an SVG clipPath system
    that turns the overlaid heading/body text white only where a particle
    currently overlaps it. Also visibility-gated and frame-cache-optimized
    (no per-frame layout reads).
  - **Real research copy** added verbatim for Mass Cytometry, Latex Films
    (BASF/FRET paragraph), and Cellulose Nanocrystals (CNCs), plus a
    user-approved page-intro subtitle.
  - Each of the three interactive sections links out via a "Learn more"
    button to its still-placeholder deep-dive page (see below).
- **Publications page (`publications.html`)**: full real list (67 entries,
  2020–2025) fetched from the live Winnik group site, formatted in the
  brief's mono citation style, DOI/article links preserved.
- **People / Winnik pages**: real member table and PI bio content in place;
  a few members without a photo fall back to a shared grayscale
  `placeholder.png` rather than a broken image.
- **Footer**: consistent single-line copyright + Dept. of Chemistry link +
  University of Toronto link (right-aligned) on all pages — deduplicated
  after an earlier pass had redundant copyright text.
- **Local dev workflow**: static server via `python3 -m http.server 8000`;
  review happens live in the user's own browser, never via screenshots.
- **Repo housekeeping**: standalone prototype HTML files consolidated into
  a `prototypes/` folder (`chain-physics-prototype.html`,
  `core-shell-prototype.html`, `msn-prototype.html`,
  `silane-prototype.html`); oversized JPEGs in `assets/photos/headshots/`
  and the `references/` group photo compressed in place (`sips`); a
  `.gitignore` covers `.DS_Store`.

### Not started yet

- **Deep-dive pages** `mass-cytometry.html`, `films.html`, `cncs.html`:
  still the header/nav/footer shell + a placeholder note only — the real
  per-topic long-form content (beyond what's already on `research.html`)
  hasn't been written.
- **Contact page**: still a placeholder note; real content (email, room,
  address — BRIEF §6) not yet swapped in.
- **Signature hairline SVG motifs**: the skeletal-structure section markers
  described in BRIEF §2 still haven't been designed as standalone section
  dividers (the Research page's canvas scenes cover the "molecular visual
  interest" goal for now, but the hairline-SVG-as-divider idea specifically
  is separate and unbuilt).
- **Footer social links**: department social URLs from BRIEF §6 (Twitter/
  Instagram/YouTube/LinkedIn) not yet added.
- **Full responsive pass**: nav and the Research scroll-paging have been
  spot-checked; a systematic mobile pass across every page hasn't happened.
- **Open decisions from §10** (logo, news section, hosting path) are still
  unresolved — need the group's input.
- **`.git` history size**: working-tree assets are now compressed, but the
  old, larger blobs remain in git history (~110MB `.git` folder); shrinking
  that would need a history rewrite (`git filter-repo`/BFG) + force-push,
  not done and not recommended without explicit sign-off given it rewrites
  shared history.
