# Verification — 11 November 2026

## Build

- `npm ci` / lockfile-based install supported. Initial dependencies installed successfully with the cache located inside the workspace.
- `npm run build`: PASS. Strict TypeScript compilation and Vite production bundling complete.
- Runtime: Node.js 24.22.1, npm 11.9.0, Vite 7.3.8.
- Production JavaScript: 309.41 KB uncompressed / 102.59 KB gzip. CSS: 33.30 KB / 7.84 KB gzip.
- Fonts and images are self-hosted. No third-party asset fetch is needed to render a scene.

## Timing tests

`npm test`: 4 passing tests.

- Day/hour/minute/second decomposition is exact.
- The experience does not unlock during the final fractional second.
- Expired countdowns clamp to zero.
- The release UTC instant maps to 11 November 2026, 23:11 in Africa/Cairo.
- Invalid clock inputs fail clearly.

## Browser and screenshot review

Chromium via Playwright, actual rendered output. The managed Sites preview relay returned `preview relay unavailable`; installed local Chromium and a Vite development server were used to complete the user's requested browser review. A production Vite preview server was also tested.

| Viewport | Countdown | Opening | Garden | Horizontal/vertical overflow |
| --- | --- | --- | --- | --- |
| 320 × 568 | Reviewed | Reviewed | Reviewed | None |
| 375 × 667 | Reviewed | Reviewed | Reviewed | None |
| 390 × 844 | Reviewed | Reviewed | Reviewed | None |
| 430 × 932 | Reviewed | Reviewed | Reviewed | None |
| 1440 × 900 | Reviewed | Reviewed | Reviewed | None |

The 15 scene captures are accompanied by garden-detail and motion-enabled captures. Three additional clean captures come from the actual production bundle. All images resolved, fonts loaded, and no browser exceptions or HTTP errors were recorded. Frozen preview clocks make the development captures deterministic. Production states were captured by controlling the browser's clock, not by adding a preview bypass.

Visually inspected: main copy, small labels, numeral shapes, floral cropping, centre legibility, date/time, frame edges, action visibility, footer spacing, path perspective and annotation positions. Refinements were made after the first pass and re-reviewed in fresh screenshots.

## Interaction and accessibility checks

- Opening button transitions to the garden; back action returns to the opening.
- Scene headings receive focus when scenes change.
- Motion toggle does not steal focus to the heading.
- Garden detail opens and closes using a real button.
- Botanical notes opens a native modal; Escape closes it and focus returns to its trigger.
- System reduced motion disables motion; user pause/resume works when motion is enabled.
- The live clock automatically advances from countdown to opening at the release boundary.
- Visible keyboard focus, a skip link, native buttons, text labels and 44 px interaction targets are supplied. The timer is not announced every second.

This is Chromium verification, not a claim of hardware-device, Safari/VoiceOver, or comprehensive WCAG certification. A real iOS Safari pass remains appropriate before a final launch.

## Production preview protection

`node scripts/verify-production.mjs`: PASS.

- No Studio preview, fixed-clock parser, preview JavaScript chunk or query-parameter override is in the production JavaScript.
- Production DOM has no developer scene navigation.
- `?scene=garden&at=2099-01-01T00:00:00Z&clean=0` still shows the countdown before the real release time.
- After the release, an old date and `?scene=countdown` do not override the opening scene.
- Normal opening-to-garden navigation works in the production build.

The release check itself is client-side narrative timing. Server-side delivery is required if future content needs a strict time embargo; see `DESIGN.md`.
