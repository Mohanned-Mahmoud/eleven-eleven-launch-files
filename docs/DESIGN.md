# Design decisions — Phase 1

The experience is a private botanical invitation. Its composition comes from engraved invitations and garden portrait photography: a thin oval outline, a generous quiet centre, asymmetrical natural flowers at the edges, ivory type and dusty pink emphasis. There are no landing-page sections, cards, feature grids or particle effects.

## The three scenes

**The wait.** Two-line Cormorant Garamond headline, generous rhythm, a real UTC countdown with tabular lining numerals, then the specified Cairo date/time. The oval suggests an invitation waiting to be opened. Photographic foreground roses establish the garden before the visitor sees it.

**The wish.** A deliberately large 11:11, using lining numerals so the ones read clearly. The brief's copy is preserved. A fine line separates the wish from the personal promise, leading to one outlined action. Caveat appears only as a small personal aside and signature.

**The garden.** A real path, rose arches, white flowers and receding physical planes carry the scene. Its visible ground gives future growth a credible coordinate system. The title occupies the upper centre; two discoverable, keyboard-operable points reveal short, intimate notes. These interactions establish selection and focus architecture only. They do not implement planting or growth.

## Palette and typography

The six specified colors are exact Tailwind tokens in `src/styles/tokens.css`. Midnight is the page base; plum appears in shadows and opaque note surfaces. Ivory carries primary text, soft blush carries italic emphasis, dusty rose accents controls and marks, and botanical green is present in the original photography. No decorative color-gradient background is used. Gradients are restricted to photographic masking and lighting falloff.

Cormorant Garamond handles display, reading copy and numbers. DM Sans handles small utility labels and controls. Caveat provides the occasional handwritten touch. Fonts are bundled locally. Large display copy uses optical line spacing; countdown values have fixed columns and tabular numerals to avoid movement on every tick.

## Motion

GSAP manages one scoped animation context per scene. Copy enters by 13 px over 1.3 s with a small stagger. Photography settles from a 3.5% crop over 3.2 s. Foreground movement is a 7 px / 0.3 degree camera-like drift over 12 s, reversing gently. Scene exits last 0.55 s. No bounce, petal rain, fake flower growth or impossible stem motion.

The visitor can pause movement. OS reduced-motion preference disables transitions and drift; a device-level change is observed live. GSAP effects are reverted on unmount and running transitions are cancelled on teardown. Motion preferences never hide content. Incoming headings receive focus after scene changes, without taking focus when the visitor toggles motion.

## Responsive composition

Portrait is the starting point. At 320 × 568, the ornamental sprig is removed, labels and line spacing tighten, and the main action retains a usable touch target. At larger portrait sizes the content gains breathing room. Desktop widens the floral perimeter and shows a quiet vertical margin annotation; it does not stretch a mobile panel across the screen.

`100svh` establishes a stable phone viewport, without orientation lock. Content may scroll naturally in unusually short landscape windows. Decorative crop overflow is clipped at the scene boundary, not by disabling document scrolling. Native dialogs scroll internally when needed.

## Preview and release boundaries

Developer scene navigation and the fixed-clock controls are loaded only inside `import.meta.env.DEV` branches. They are absent from the production bundle. Production ignores all `?scene`, `?at`, and `?clean` parameters; there is no client-side password or secret query string.

Normal entry uses the actual clock: countdown before `2026-11-11T21:11:00Z`, then the opening scene and the garden action. The clock re-reads the current time on each update and after tab visibility changes. The displayed local time is 23:11 on 11 November 2026 in Africa/Cairo.

The static countdown is a narrative release control, not cryptographic embargo protection. If a later phase contains material that must remain inaccessible before the date, serve it from an authenticated server after checking server time. This phase includes no private messages or credentials in the bundle. The hosted review is owner-private through Sites.

## Screenshot review and refinements

Actual Chromium screenshots were captured for all three scenes at 320 × 568, 375 × 667, 390 × 844, 430 × 932 and 1440 × 900. The review led to stronger mobile reading-area masking, a better left-hand bloom crop, clearer 11:11 numerals, larger small countdown labels, an SVG replacement for an unsupported arrow glyph, and separation of the desktop path annotation from the handwritten line. Images were reviewed again after these refinements.

## Deliberate Phase 1 limits

No growth simulation, planting, persistence, soundtrack, personal letter, activity tracking or full multi-chapter site has been added. The garden is a photographic spatial prototype. A matched twilight plate and commissioned layered botanical artwork are specified in `ASSETS.md` before Phase 2 proceeds.
