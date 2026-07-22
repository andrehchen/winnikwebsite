// ============================================================================
// Sections in this file:
//   1. NAV TOGGLE        — mobile hamburger menu
//   2. PEG MORPH         — scroll-driven hero animation (chain draw, OH cap
//                          countdown, Research "dock" sequence). By far the
//                          largest/most stateful part of this file.
//   3. SCROLL CUE        — hero chevron that jumps to the Research section
// ============================================================================

// ---- 1. Nav toggle --------------------------------------------------------
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

// ---- 2. Peg morph ----------------------------------------------------------
// Element map (all ids live in index.html's .peg-morph block):
//   pegFrame            — the growing/clipping container; its height IS the
//                          scroll-driven "how much has drawn so far" value.
//   pegChain            — hidden SVG holding the full 40-repeat-unit chain.
//   pegChainPath        — the visible zigzag; drawn via stroke-dashoffset. A
//                          single continuous subpath (see comment in
//                          index.html) — do not reintroduce per-label moveto
//                          gaps here without also un-breaking the dash draw.
//   pegAbbrev           — static at-rest illustration (H-O-...-OH, no scroll
//                          needed) that pegChain morphs out of/into.
//   pegOhCap            — the traveling "[...]n OH" group; repositioned to
//                          the current chain tip every scroll frame.
//   pegOhN              — live countdown of repeat units left to draw.
//   pegOhBrackets        — the "[...]n" bracket part of pegOhCap; fades out
//                          over the final repeat unit as pegOhN hits 0.
//   landingProjects     — the "Our projects include" list, fades in mid-draw.
//   thesisWrap           — sidebar (thesis + projects list); JS-driven
//                          pseudo-sticky, docks level with Research.
//   landingSplit/researchEl/downstreamEls — see updateDock() below.
const siteHeader = document.querySelector(".site-header");
const pegFrame = document.getElementById("pegFrame");
const pegChain = document.getElementById("pegChain");
const pegChainPath = document.getElementById("pegChainPath");
const pegAbbrev = document.getElementById("pegAbbrev");
const pegOhCap = document.getElementById("pegOhCap");
const pegOhN = document.getElementById("pegOhN");
const pegOhBrackets = document.getElementById("pegOhBrackets");
const pegDisplayFrame = document.getElementById("pegDisplayFrame");
const pegDisplayFrameLabel = pegDisplayFrame ? pegDisplayFrame.querySelector(".peg-display-frame__label") : null;
const pegDisplayFrameLines = pegDisplayFrame ? Array.from(pegDisplayFrame.querySelectorAll(".peg-display-frame__box-line")) : [];
const landingProjects = document.getElementById("landingProjects");
const thesisWrap = document.querySelector(".landing__thesis-wrap");
const landingSplit = document.querySelector(".landing__split");
const researchEl = document.getElementById("overview");
// Everything visually "below" Research — the rest of the page content that
// should hold still (in lockstep with Research) during the dock freeze,
// rather than scrolling normally underneath/through the frozen section.
const downstreamEls = [
  ...document.querySelectorAll("main > .section-preview"),
  document.querySelector(".site-footer"),
].filter(Boolean);
const pegLabels = pegChain ? Array.from(pegChain.querySelectorAll(".peg-chain__label")) : [];
const isMobileStack = () => window.matchMedia("(max-width: 640px)").matches;

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Reassigned below once the chain's real measurements are known — lets the
// scroll-cue jump straight to the fully-drawn state instead of waiting for
// scroll events to grow the chain (and the page) out to its real height.
let forceChainComplete = () => {};
// Un-freezes scroll-driven updates after the scroll-cue's jump animation
// settles, so scrolling back up afterward still re-engages every animation
// instead of leaving the page permanently stuck in the "complete" state.
let releaseChainComplete = () => {};

if (pegFrame && pegChain && pegChainPath && pegAbbrev && pegOhCap) {
  const totalLength = pegChainPath.getTotalLength();
  // pegChainPath is a single continuous subpath (no per-label moveto gaps —
  // see comment in index.html), so getPointAtLength against it directly is
  // already continuous; no separate measurement twin needed.
  const measureTotalLength = totalLength;
  const measurePath = pegChainPath;
  const chainStartY = 99.67; // first point of pegChainPath — where the abbreviated unit hands off
  const chainEndY = 4880.27; // last point of pegChainPath
  const labelThresholds = pegLabels.map((label) => {
    const y = parseFloat(label.getAttribute("y"));
    return clamp((y - chainStartY) / (chainEndY - chainStartY), 0, 1);
  });

  if (prefersReducedMotion) {
    // Skip the scroll-tied build entirely — show the fully drawn chain directly.
    pegChainPath.style.strokeDasharray = "none";
    pegChainPath.style.strokeDashoffset = "0";
    pegLabels.forEach((label) => { label.style.opacity = "1"; });
    pegFrame.style.height = `${pegChain.getBoundingClientRect().height + 40}px`;
    if (landingProjects) {
      landingProjects.style.opacity = "1";
    }
    const endPoint = measurePath.getPointAtLength(measureTotalLength);
    pegOhCap.setAttribute("transform", `translate(${endPoint.x},${endPoint.y})`);
    if (pegOhN) {
      pegOhN.textContent = "0";
    }
    if (pegOhBrackets) {
      pegOhBrackets.style.opacity = "0";
    }
    if (pegDisplayFrame) {
      pegDisplayFrame.style.opacity = "0";
    }
    if (siteHeader) {
      siteHeader.classList.add("is-scrolled");
    }
  } else {
    pegChainPath.style.strokeDasharray = String(totalLength);
    pegChainPath.style.strokeDashoffset = String(totalLength);

    // Display-case box around the resting molecule: the two corner-bracket
    // lines retract (dashoffset 0 -> own length) and the "PEGn" label fades,
    // both over a short fixed scroll distance right at the top of the page —
    // quick enough to feel like it clears out of the way as soon as the user
    // starts scrolling, independent of how long the full chain-draw takes.
    const DISPLAY_FRAME_FADE_RANGE = 260;
    const displayFrameLineLengths = pegDisplayFrameLines.map((line) => {
      const len = line.getTotalLength();
      line.style.strokeDasharray = String(len);
      line.style.strokeDashoffset = "0";
      return len;
    });

    // uiRange paces the quick cosmetic transitions (nav logo swap).
    // drawRange paces the chain drawing itself close to 1:1 with scroll distance
    // (a slight 10% speedup — DRAW_SPEEDUP — so it wraps up a touch sooner)
    // so the drawing tip stays near the viewport instead of racing ahead.
    const uiRange = () => window.innerHeight * 1.4;
    const DRAW_SPEEDUP = 1 / 1.1;

    let initialHeight = 0;
    let fullHeight = 0;
    let drawRange = 1;
    let frameTop = 0;
    let splitTop = 0;
    const measureHeights = () => {
      initialHeight = pegAbbrev.getBoundingClientRect().height;
      fullHeight = pegChain.getBoundingClientRect().height;
      drawRange = Math.max((fullHeight - initialHeight) * DRAW_SPEEDUP, 1);
      // pegFrame's and .landing__split's own top position on the page —
      // stable regardless of pegFrame's current height, since growth only
      // moves the bottom edge. Read before any transform has been applied
      // (transforms don't move layout, so this is safe at any time, but we
      // measure once up front for clarity).
      frameTop = pegFrame.getBoundingClientRect().top + window.scrollY;
      splitTop = landingSplit ? landingSplit.getBoundingClientRect().top + window.scrollY : frameTop;
    };
    measureHeights();
    window.addEventListener("resize", () => {
      measureHeights();
      updateMorph();
    });

    // The OH cap's stub + label extend a bit past the raw tip point, so the
    // frame needs a little extra room beyond the tip or it clips the cap.
    const OH_CAP_BUFFER = 40;

    // --- Research "dock" sequence ---
    // Research enters from the bottom via normal scroll (unchanged). Once its
    // top reaches DOCK_TOP_FRACTION of the viewport, it freezes there via a
    // translateY that exactly cancels further natural movement — and so does
    // everything below it (Winnik, People, Publications, Contact, footer),
    // shifted by the same amount, so the whole rest of the page holds still
    // together instead of sliding up underneath the frozen Research block.
    // Over the same window, the thesis sidebar (pinned near the header the
    // whole time before this) slides its own pin point down to meet Research
    // at that same spot. Once both are docked, the freeze value goes constant,
    // which — since a constant offset doesn't fight the ongoing scroll — makes
    // everything resume moving upward together at normal speed, instead of
    // snapping loose.
    const DOCK_TOP_FRACTION = 0.45;
    const DOCK_WINDOW_FRACTION = 0.4;
    const headerOffsetPx = (() => {
      const rootStyle = getComputedStyle(document.documentElement);
      const remPx = parseFloat(rootStyle.fontSize) || 16;
      const parseRemVar = (name) => parseFloat(rootStyle.getPropertyValue(name)) * remPx;
      return parseRemVar("--header-h") + parseRemVar("--space-6");
    })();

    // Once the scroll-cue forces the chain to completion, stop letting scroll
    // events shrink it back down mid-scroll (the target position the browser
    // is animating toward has to stay put).
    let chainCompleted = false;

    const setDownstreamShift = (px) => {
      const value = px > 0 ? `translateY(${px}px)` : "";
      researchEl.style.transform = value;
      downstreamEls.forEach((el) => { el.style.transform = value; });
    };

    const updateDock = (maxHeight) => {
      if (!thesisWrap || !researchEl) return;
      if (isMobileStack()) {
        thesisWrap.style.transform = "";
        setDownstreamShift(0);
        return;
      }

      const dockTop = window.innerHeight * DOCK_TOP_FRACTION;
      const dockWindow = window.innerHeight * DOCK_WINDOW_FRACTION;
      const freezeStartY = frameTop + maxHeight - dockTop;
      const releaseY = freezeStartY + dockWindow;
      const effectiveScrollY = Math.min(window.scrollY, releaseY);

      const shift = Math.max(0, effectiveScrollY - freezeStartY);
      setDownstreamShift(shift);

      const dockT = clamp((window.scrollY - freezeStartY) / dockWindow, 0, 1);
      const sidebarTargetTop = headerOffsetPx + dockT * (dockTop - headerOffsetPx);
      // Before the sidebar's natural position has even scrolled up to the pin
      // point, it needs no shift at all — without this clamp it gets yanked
      // up (negative translateY) from scroll 0, overlapping the wordmark.
      // Real position:sticky does this automatically; we have to do it by hand.
      const sidebarShift = Math.max(0, sidebarTargetTop - splitTop + effectiveScrollY);
      thesisWrap.style.transform = `translateY(${sidebarShift}px)`;
    };

    const updateMorph = () => {
      if (chainCompleted) return;

      const uiProgress = clamp(window.scrollY / uiRange(), 0, 1);
      const drawProgress = clamp(window.scrollY / drawRange, 0, 1);
      const displayFrameProgress = clamp(window.scrollY / DISPLAY_FRAME_FADE_RANGE, 0, 1);

      pegDisplayFrameLines.forEach((line, i) => {
        line.style.strokeDashoffset = String(displayFrameProgress * displayFrameLineLengths[i]);
      });
      if (pegDisplayFrameLabel) {
        pegDisplayFrameLabel.style.opacity = String(1 - displayFrameProgress);
      }

      const naturalHeight = initialHeight + drawProgress * (fullHeight - initialHeight) + OH_CAP_BUFFER;
      const maxHeight = fullHeight + OH_CAP_BUFFER;
      // The hero content above the frame is shorter than a viewport, so
      // drawing 1:1 with scroll alone lets the next section peek into view
      // early. Keep the frame at least tall enough to hold the viewport's
      // bottom edge until the chain is actually done (capped at its real height).
      const minToStayBelowFold = window.scrollY + window.innerHeight - frameTop;
      const frameHeight = Math.min(maxHeight, Math.max(naturalHeight, minToStayBelowFold));

      pegFrame.style.height = `${frameHeight}px`;
      if (landingProjects) {
        landingProjects.style.opacity = String(clamp((drawProgress - 0.2) / (0.65 - 0.2), 0, 1));
      }
      pegChainPath.style.strokeDashoffset = String(totalLength * (1 - drawProgress));

      pegLabels.forEach((label, i) => {
        label.style.opacity = drawProgress >= labelThresholds[i] ? "1" : "0";
      });

      // Exact count of repeat units (O labels) not yet drawn, plus a smooth
      // (non-integer) version of the same quantity to fade the bracket out
      // over the last unit — reaching 0 opacity right as n reaches 0.
      const remainingContinuous = pegLabels.length * (1 - drawProgress);
      if (pegOhN) {
        const remaining = labelThresholds.reduce((count, t) => count + (drawProgress >= t ? 0 : 1), 0);
        pegOhN.textContent = String(remaining);
      }
      if (pegOhBrackets) {
        pegOhBrackets.style.opacity = String(clamp(remainingContinuous, 0, 1));
      }

      const tip = measurePath.getPointAtLength(measureTotalLength * drawProgress);
      pegOhCap.setAttribute("transform", `translate(${tip.x},${tip.y})`);

      updateDock(maxHeight);

      if (siteHeader) {
        siteHeader.classList.toggle("is-scrolled", uiProgress > 0.6);
      }
    };

    forceChainComplete = () => {
      chainCompleted = true;
      const maxHeight = fullHeight + OH_CAP_BUFFER;
      pegFrame.style.height = `${maxHeight}px`;
      pegChainPath.style.strokeDashoffset = "0";
      pegLabels.forEach((label) => { label.style.opacity = "1"; });
      const endPoint = measurePath.getPointAtLength(measureTotalLength);
      pegOhCap.setAttribute("transform", `translate(${endPoint.x},${endPoint.y})`);
      if (pegOhN) {
        pegOhN.textContent = "0";
      }
      if (pegOhBrackets) {
        pegOhBrackets.style.opacity = "0";
      }
      pegDisplayFrameLines.forEach((line, i) => {
        line.style.strokeDashoffset = String(displayFrameLineLengths[i]);
      });
      if (pegDisplayFrameLabel) {
        pegDisplayFrameLabel.style.opacity = "0";
      }
      if (landingProjects) {
        landingProjects.style.opacity = "1";
      }
      // Land directly in the fully-docked state — Research and the sidebar
      // already aligned at the bottom, as if the user had scrolled through
      // the whole dock sequence.
      if (thesisWrap && researchEl && !isMobileStack()) {
        const dockTop = window.innerHeight * DOCK_TOP_FRACTION;
        const dockWindow = window.innerHeight * DOCK_WINDOW_FRACTION;
        const freezeStartY = frameTop + maxHeight - dockTop;
        const releaseY = freezeStartY + dockWindow;
        setDownstreamShift(releaseY - freezeStartY);
        thesisWrap.style.transform = `translateY(${dockTop - splitTop + releaseY}px)`;
      }
      if (siteHeader) {
        siteHeader.classList.add("is-scrolled");
      }
    };

    releaseChainComplete = () => {
      chainCompleted = false;
      updateMorph();
    };

    updateMorph();
    window.addEventListener("scroll", updateMorph, { passive: true });
  }
}

// ---- 3. Scroll cue ---------------------------------------------------------
const scrollCue = document.querySelector(".hero-scroll-cue");
const overview = document.getElementById("overview");
if (scrollCue && overview) {
  const hideThreshold = () => overview.getBoundingClientRect().top + window.scrollY - window.innerHeight / 2;

  const updateScrollCue = () => {
    scrollCue.classList.toggle("is-hidden", window.scrollY > hideThreshold());
  };

  updateScrollCue();
  window.addEventListener("scroll", updateScrollCue, { passive: true });

  scrollCue.addEventListener("click", (event) => {
    event.preventDefault();
    forceChainComplete();
    overview.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });

    // The freeze above only exists so the browser's smooth-scroll animation
    // has a stable target to land on (otherwise scroll-driven updates mid-
    // animation would keep resizing the page out from under it). Release it
    // once that scroll settles, so scrolling back up afterward still
    // re-engages every animation instead of leaving the page stuck.
    let released = false;
    const release = () => {
      if (released) return;
      released = true;
      window.removeEventListener("scrollend", release);
      releaseChainComplete();
    };
    window.addEventListener("scrollend", release);
    setTimeout(release, 1000);
  });
}
