# 11:11 — A Garden Made for You

A mobile-first, three-scene romantic experience built with React, Vite, TypeScript, Tailwind CSS and GSAP. Phase 1 includes a working countdown, cinematic invitation, and interactive photographic garden prototype.

## Run locally

Requirements: Node.js 22.12+ (tested with 24.22) and npm.

```sh
npm ci
npm run dev
```

Open `http://localhost:5173`. In development, the Studio preview at the bottom switches among all three scenes.

- `/?scene=countdown` — the waiting scene
- `/?scene=opening` — the invitation
- `/?scene=garden` — the garden
- `/?scene=countdown&at=2026-11-11T17:18:06Z` — deterministic countdown review
- Add `&clean=1` to hide the development toolbar for presentation screenshots.

These parameters and the toolbar are compiled out of production. Do not enable a production preview flag or place a password in `VITE_*` variables.

## Build and verify

```sh
npm test
npm run build
npm run preview
```

The production artifact is `dist/`. Normal entry follows the real release time, `2026-11-11T21:11:00Z` (11:11 PM Cairo), and automatically advances to the opening. Before the date, visitors see the countdown. The opening button leads to the garden. Both garden detail points, the back action, pause-motion toggle, and credits dialog work.

Browser verification uses Playwright and a local Chromium executable:

```sh
# Keep npm run dev running in another terminal.
CHROMIUM_PATH=/usr/bin/chromium npm run test:browser
```

Set `CHROMIUM_PATH` to your installed Chrome/Chromium executable. The script captures all 15 requested scene/viewport combinations plus interaction states in `work/screenshots`, verifies page dimensions, image loading, runtime errors, scene navigation, focus, dialog behavior, reduced motion and the release boundary. `scripts/verify-production.mjs` separately tests the served production build with all preview query parameters.

## Architecture

```text
src/
  config/experience.ts      copy, release time, garden interaction anchors
  config/assets.ts          licensed local asset manifest and provenance
  SceneManager.tsx          release state, scene transitions, common chrome
  scenes/                   Countdown, Opening, Garden
  components/               typography, scene layout, flowers, credits, ornaments
  hooks/                    wall clock and system/user motion preference
  lib/                      pure countdown math and scoped GSAP helpers
  styles/tokens.css         exact palette, typography, layout and layering tokens
  styles/index.css          portrait-first art direction and responsive rules
  dev/                      development-only scene dock and clock override
```

Supporting libraries are intentionally limited to self-hosted Fontsource fonts and Lucide SVG icons. Native browser dialogs provide modal semantics and keyboard focus management. No extra state manager, router, canvas engine or 3D runtime is needed for this phase.

## Handoff documents

- `docs/PLAN.md` — implementation sequence
- `docs/DESIGN.md` — visual decisions, motion, responsive behavior and preview security
- `docs/ASSETS.md` — image provenance, license links and exact production asset requirements
- `docs/VERIFICATION.md` — build and browser verification results
- `docs/licenses/` — font and icon licenses

Flower growth mechanics remain reserved for Phase 2. The current garden is a real photographic study graded toward twilight; the dedicated twilight plate and professional layered botanical artwork are specified in the asset brief.
