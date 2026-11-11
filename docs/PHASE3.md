# Phase 3 — Build your own bouquet

The original scenes and floral assets are preserved. A fifth Bouquet scene is connected to Grow. The garden bed still holds at most eight flowers, with the existing spacing and two-growth concurrency limit. A bouquet can contain twelve real picked flowers: picking removes a mature flower from the soil and frees its position for the next planting. Tests grow and pick twelve flowers through this actual workflow; no pre-filled production selection or generic bouquet image is used.

## Identity and editing

SceneManager now owns session-only planted, mature, picked and selected flower records, plus the monotonically increasing flower ID. Each record retains its variety, color, lean and original coordinates. Mature flower heads are accessible selection buttons. Tapping opens an Add to bouquet action; growing buds cannot be selected. Picking does not change the current color/variety. Existing planting Undo and Clear affect the planting bed, not picked flowers.

The live bouquet uses a deterministic staggered arrangement with varied head heights, stem lengths, lean and occlusion. Up to twelve flowers remain individually rendered. A shared appearance function supplies the exact growing-scene hue, saturation and brightness to both bouquet rendering and export. Existing image files are unchanged; small rendering clips remove stray atlas-edge fragments from the ivory composition.

Tapping a selected thumbnail removes it. Undo restores the previous complete selection. Removed flowers remain available under Flowers you picked, and can be added back. Going back to grow preserves the bed and picked flowers. Make Another clears the arrangement and retains the picked collection for a new arrangement. The current picking collection is capped at twelve. Continue presents a quiet closing note; no unrelated next chapter is added. State lasts for this tab session's React lifetime, not a reload.

## Wrapping

GSAP stages individual flower settling, the rear paper sheet, left fold, right fold, the satin band and bow. Movement uses a shared binding point, small rotation and sine easing; no bounce or spinning. It lasts about 6.3 seconds. All timelines are scoped and reverted on unmount. Reduced motion and Pause resolve to the finished arrangement immediately. Ivory paper folds and satin ribbon are original SVG geometry with restrained light/shadow gradients. They are part of the same artwork renderer used for the saved image.

## PNG and mobile saving

The shared SVG geometry contains the actual chosen flowers, paper and ribbon. Before export, every same-origin WebP asset is fetched and embedded as a data URI. SVG standard color filters reproduce the growing colors; no foreignObject, DOM screenshot library, external SVG image URLs or remote font fetches are used. The SVG is decoded into an Image and painted on an 1800 × 2400 Canvas with ivory background, fine border and the final two message lines. Existing local fonts are loaded before Canvas text is painted. A PNG Blob is created with toBlob; object URLs are revoked after use.

The PNG is prepared before enabling Save My Bouquet so navigator.share receives the File during the original user gesture. When file sharing is supported, the native share sheet can save/share the PNG. Otherwise the browser gets a PNG download plus a retained Open image to save link. That link supports iOS touch-and-hold saving. User-cancelled sharing is not treated as an error. Preparation failures expose a retry action. Export contains no navigation, controls or unrelated UI.

## Verification

- Fourteen unit tests: original timing/placement tests plus 1/3/5/8/12 composition identity, deterministic geometry, unique IDs, limits, asset paths and color-filter fidelity.
- Chromium browser: actual growth, mature selection and harvesting for bouquets of 1, 3, 5, 8 and 12; removal, undo, back/add, wrapping, reduced motion, Continue and Make Another.
- Every bouquet exports an actual PNG verified as 1800 × 2400 with image content, and export files are visually reviewed. Screenshots include editor and final states at 390px, plus final states at 320px and 430px. Vertical scrolling is intentional on small screens; no horizontal overflow.
- iPhone 13 and Pixel 5 Chromium device emulation: real touch interactions, mocked file-share API verifies PNG metadata and active user gesture, then actual download and image-link fallback.
- Original Phase 1 responsive/interaction checks and Phase 2 growth checks are run for regressions. Production build and preview stripping are checked.

### Verification limit

The Playwright WebKit browser was downloaded and launch was attempted. This host lacks libgtk-4, libgraphene, libharfbuzz-icu, libmanette, libhyphen and libGLESv2. No scoped system package installer or sudo is available. Actual WebKit/iOS Safari and physical Android testing therefore remain unverified. The iPhone device-emulation result is Chromium, not a claim of Safari execution. A final physical-device save-to-Photos check remains necessary before calling iOS support fully verified.

## Commands and review

`npm test`, `node scripts/verify-bouquet.mjs`, `node scripts/verify-bouquet-mobile-save.mjs`, `node scripts/verify-browser.mjs`, `node scripts/verify-grow.mjs`, then `npm run build`.

Development only: `/?scene=grow&clean=1` or `/?scene=bouquet&clean=1`. The latter starts empty; the test builds selections by actually growing/picking flowers. Production ignores query overrides. Review captures and sample PNG exports are provided under `/handoff/phase3/`. Flower artwork retains the Phase 2 generated-study provenance; no new or replacement floral assets are introduced.
