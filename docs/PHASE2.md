# Phase 2 — Grow your flowers

The original Countdown, Opening and Garden scenes remain in place. Garden gains an onward action to a dedicated Grow scene. No wrapping or export is implemented.

## Interaction

The four supplied introduction sentences reveal in sequence. The start action opens the planting surface. Five species and five muted colors are available. Touch coordinates are normalized against the actual stage rectangle; flowers retain relative root positions on viewport changes. The safe area is an ellipse bounded by x=10–90%, y=71–92%, excluding the heading and controls. Neighbouring roots must be at least 54–78 pixels apart (responsive spacing). Placement capacity depends on available space and is capped at eight. No growth queue accumulates: at most two flowers are actively growing. Undo immediately removes the last planted flower and cancels its animation. Clear requires inline confirmation. Keyboard Enter/Space finds an available planting position.

Each flower has a GSAP context with a growing stroke, independent photographic leaf pivots, a separate bud, five opening petal layers and a masked photographic bloom. This is not whole-flower scaling. Timeline: root/sprout 0–0.5s, stem 0.12–1.92s, staggered leaves 0.8–2.5s, bud 1.8–2.55s, petals 2.45–4.01s, head reveal 2.9–4.8s. A very small root-anchored sway follows. Eight sway tweens plus two growth timelines is the upper bound. All GSAP contexts are reverted when removed. Pause or OS reduced motion immediately resolves growth to the finished state and removes sway. A native button-like planting region provides keyboard access; updates are announced through a status region.

State is in memory for the current scene visit. Returning to the introductory Garden starts a fresh growing visit. No personal content or persistent storage is added.

## Assets: study status, not final commissioned artwork

The repository did not contain professional layered botanical assets. The flower heads, matching buds, detached petals, photographic foliage and soil plate in `public/images/grow/` are **generated photographic art-direction studies** made specifically for this implementation with the image generation tool. They are not represented as licensed third-party photographs, scientifically exact opening sequences, or commissioned botanical artwork. Professional final artwork is still missing.

Two generated transparent atlases were visually inspected, then cropped and encoded as WebP layers. Atlas 1: five species × head/bud/detached-petal; atlas 2: four foliage silhouettes and a soil plate. Ranunculus currently shares the peony foliage study and needs its own anatomically correct dissected foliage. Stem drawing is original SVG. Colors are subtle photographic filters rather than five independently photographed pigment sets. See `src/grow/assets.ts` for provenance and runtime paths. The original licensed garden photograph remains the distant background under twilight shading.

### Exact replacement brief

Commission matched specimens of Rosa, Tulipa, Paeonia, Ranunculus and Cosmos with blush, ivory, dusty rose, peach and muted lavender colorways. For each, supply 2400–3200px transparent, premultiplied-alpha-safe layers: root/sprout, segmented curved stem, individually separable species-correct leaves, calyx, tightly closed bud, at least 3 opening stages, 5–12 individually cut outer petals, and an open inner head. Photograph/draw the same specimen and viewpoint across states with soft upper-left twilight lighting, realistic venation and irregular edges. Avoid a detached petal rotating fan as the final biological opening model; final assets should have species-specific petal articulation and anchors.

Give each layer a root/pivot, petal attachment point, real specimen height, species, occlusion order and light direction. Deliver a matched 3000px soil/ground plate, clean foreground and separate contact-shadow layer. Approve test composites at 320px width. Obtain written web/animation/compositing rights and author credits, retaining the license in the manifest. The current studies make the interaction reviewable while these assets are procured.

## Verification

Playwright + local Chromium: 320×568, 390×844, 430×932, with real touch taps. Before/after, introduction and intermediate growth screenshots are saved under `/handoff/phase2/screenshots/`. Checked all five species, safe-zone rejection, occupied-position rejection, concurrency, touch coordinate mapping, resize, undo, clear cancel/confirm, keyboard placement, pause/resume and reduced motion. No browser exceptions. Phase 1's 15 scene/viewport regression captures and interaction/release checks also pass. Seven timing/placement unit tests pass. Production build and production preview stripping are verified after implementation.

The managed preview relay is unavailable in this environment; the user's requested browser review uses the already-installed Chromium/Playwright and Vite server as in Phase 1. No WebGL or added dependencies.
