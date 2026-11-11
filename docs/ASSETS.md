# Botanical assets and requirements

## Included photography

All three images were inspected at their downloaded resolution before use. They are independent real photographs, not generated imagery. Files are self-hosted; the finished experience does not depend on Unsplash requests. Optimized mobile/desktop WebP derivatives retain natural petal texture and optical depth. The sources explicitly state the Unsplash License as of 11 November 2026.

| Asset | Photographer and source | Source image | Included derivatives | Placement |
| --- | --- | --- | --- | --- |
| Three pale pink roses | [FELIXFELIX FELIX](https://unsplash.com/photos/-2n7ZLXShAc) | `photo-1786297447417-4900b4b6cce8`, 2000 × 2500 downloaded | `roses-dark.webp`, `roses-dark-mobile.webp` | Right foreground in the waiting and opening scenes |
| Pink garden rose | [Inc inductgroup](https://unsplash.com/photos/yP3qY0p1-NA) | `photo-1781107254194-01b9fbdeaec5`, 2000 × 2994 downloaded | `garden-rose.webp`, `garden-rose-mobile.webp` | Left foreground; distinct bloom, foliage and natural depth of field |
| Rose-arch garden path | [Annie Spratt](https://unsplash.com/photos/ZYNbJcl4mAo) | `photo-1781438150201-50aae7557825`, 2400 × 1594 downloaded | `garden-path.webp`, `garden-path-mobile.webp` | Continuous garden scene with an actual gravel plane and receding arches |

License: [Unsplash License](https://unsplash.com/license). Free commercial and noncommercial use, including downloading, modifying and distributing as part of the site. Do not sell unmodified images or compile a competing image service. Photographer credit and provenance remain documented here and in the runtime asset manifest.

The same established foreground photographs carry through the countdown and opening for visual continuity. Within a composition no flower has been cloned, mirrored or stamped. No stock collage grid, 3D flower, generative background or synthetic particles are used. The garden is one continuous photograph, not assembled scenery.

## Typeface and icon licenses

- Cormorant Garamond, DM Sans and Caveat: bundled by Fontsource, SIL Open Font License. Source distributions and license text are retained in `docs/licenses/`.
- Lucide icons: ISC License; license text retained in `docs/licenses/`.
- The small engraved-style sprig and favicon are original SVG linework created for this project. They are ornamental marks, not substitutes for production flower artwork.

## What the photographs can and cannot provide

The current photographs are suitable for these visual prototypes. The garden has a genuine physical ground plane, occlusion, scale changes and depth, but it was photographed in daylight. CSS exposure, desaturation and plum shadows provide the twilight study. A dedicated twilight photograph is required to finish the exact cinematic lighting direction; this prototype is not being presented as a photographed-at-twilight final asset.

No professional layered botanical artwork was supplied or commissioned. The following assets are deliberately specified rather than replaced with low-quality growth placeholders. They are a prerequisite for Phase 2's flower growth, not part of the implemented mechanics.

## Exact next-production asset brief

### 1. Matched twilight garden plates

- Capture one real rose garden at blue hour, 15–30 minutes after sunset. Soft residual side light, lifted petal highlights, deep green foliage, natural plum shadows. Avoid hard artificial lighting and visible street fixtures.
- Master: at least 6000 × 4000, 16-bit TIFF or high-quality RAW conversion, sRGB delivery. Supply a separate composed portrait capture at least 3000 × 5000; do not rely solely on a landscape crop.
- Camera about 1.0–1.3 m above ground, 45–65 mm full-frame equivalent; a gravel/soil path enters bottom center and recedes to a vanishing point at approximately 52% x / 57% y.
- Foreground roses at 15–30% and 72–90% x; clear reading region in the upper center. Reserve approximately the middle 65% of portrait width above 40% height for text.
- Deliver matched clean ground, background foliage and foreground occlusion plates from a locked tripod. Include one reference with a color checker and lighting direction notes.
- Retain at least 8% overscan for slow camera movement. No people, text, brand marks or recognisable private property requiring additional releases.
- Target compressed web derivatives: portrait 1300 × 2000 ≤ 450 KB; landscape 2400 × 1600 ≤ 800 KB.

### 2. Professional botanical artwork for growth

- Commission a botanical artist for 6–8 distinct specimens: three individual blush/dusty rose stems, two small white cosmos/anemone-like stems and three varied foliage elements. Match actual garden species where possible.
- Deliver layered PSD or lossless transparent PNG masters, 2400–3200 px on the longest edge, with clean alpha edges and neutral colour. Include petals, flower head, calyx, individual leaves and segmented stem on separately named layers.
- Supply bud, opening and bloom states for each rose from the same viewpoint, with consistent root and stem anchors. Do not resize one flower to imply several growth stages.
- Each specimen needs a species label, physical height, ground/root anchor, stem pivot coordinates, foreground/background ordering and light direction. Shadows belong on separate multiply layers.
- Visual target: observational, softly lit, delicate veining, irregular petal edges; no plastic highlights or airbrushed symmetry. Approve actual test composites on the garden plate before final delivery.
- Obtain a written commercial web license covering compositing, animation, colour grading and asset delivery to the project owner; retain author and license metadata in the manifest.

### 3. Optional future ambient audio

Not included or simulated. If desired in a later phase, commission/license a seamless 45–90 second real evening-garden loop, no music or sudden calls, delivered lossless plus 96–128 kbps web audio. It must start only after an explicit visitor action.

### Arabic typography

Amiri Regular, Arabic subset, by Khaled Hosny and contributors. Self-hosted as `public/fonts/amiri-arabic-400-normal.woff2`, sourced from Fontsource’s Amiri distribution. Licensed under the SIL Open Font License 1.1; full license in `docs/licenses/Amiri-OFL.txt`. Used for Arabic copy alongside the existing Latin typefaces.
