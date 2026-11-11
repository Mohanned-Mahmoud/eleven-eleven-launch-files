# Phase 4 launch handoff — deployment still required

The eleven-scene sequence is implemented using the existing manager: Countdown → Opening → Invitation → Eleven Little Things → constellation game → memories → original Garden → Grow → Bouquet → Wish → Letter. Original botanical and bouquet assets are preserved. The letter signature reveals a configured hidden message. Wishes stay in memory and are not transmitted.

## Central personalization

Edit `server/personalization.ts`. Recipient, sender, eleven messages, inside jokes, memory captions/images, song and license, letter and hidden messages are explicit bracketed placeholders. No real shared memory has been invented. This file must never be imported at runtime from `src/`; Vite configuration only imports it in the Node development server. Browser code requests it from the protected content endpoint after launch. Fill the eleven messages and letter before recipient delivery. Missing song files remain silent; soundtrack controls appear only with a file and license reference. Audio starts only through its Play control and pause/mute persists across scenes.

## Vercel deployment

This implementation is NOT deployed on Vercel yet: no Vercel account/project connection is available. The old private Sites URL remains the Phase 3 preview and is NOT the secure launch deployment. Do not deploy the Phase 4 dist as a static site.

1. Connect this repository to the intended Vercel project. Use Node 22 or 24, framework preset Other (config sets framework null), root directory this project. `vercel.json` declares build command, minimal non-private `vercel-public` fallback output, and a catch-all route to the Node gateway. There must be no filesystem/static bypass route before the gateway. Remove dashboard rewrites that bypass this route. Built `dist/**` is included only in the serverless bundle.
2. Run `npm ci` and `npm run build`. This removes old handoff/source archives from deployment output. The gateway also denies `/handoff` at all times. Do not upload old source archives, private config, or separate public asset copies to a CDN.
3. Set environment variables from `.env.example` in Vercel settings, not client VITE variables. PREVIEW_SECRET (24+ random characters) enables the five-second logo hold plus password test entry, backed by a signed HttpOnly/Secure one-hour cookie. This does not alter public launch timing. See DEPLOY-VERCEL.md. Launch constant is `2026-11-11T21:11:00Z`, 23:11 Africa/Cairo. All unlock decisions use server Date.now.
4. Deploy, then repeat real HTTPS security tests before launch: root is countdown only; `/api/content`, actual `/assets/*.js` and `/images/grow/rose-head.webp` return 423; `/handoff` returns 404. Spoof Date/request headers and future client time must not unlock anything. Check both direct function and rewritten paths on the actual deployment. Confirm cache headers are private/no-store. After the actual boundary, verify status true, Opening entry and the complete user flow. Vercel routing and cron configuration require live validation; local tests do not certify the deployed edge configuration.

The server renders the approved Countdown component and its existing styles. Before launch no module script or application bundle is delivered. Only the public countdown rose photographs, fonts, favicon and push service worker are allowed; personal memory/audio assets and all application JS are denied. The inline clock advances from server time with monotonic elapsed time and rechecks the server every ten seconds, at zero and on tab visibility. A server-verified unlock reloads into the original animated Opening. Errors remain locked. Responses, including errors, use no-store headers for browser/CDN. Personalization is absent from production JavaScript. Public countdown artwork is intentionally not secret.

## Notifications

In-page launch alert and an ICS Add to Calendar download are implemented. In-page alerts require the page to remain open and active enough to execute timers; calendar notifications depend on the recipient's calendar settings.

Persistent Web Push backend is implemented in `server/push.ts`: Redis REST subscription storage, approved push endpoint validation, VAPID signing, server-time-gated cron delivery, expiring claims, per-subscription delivery receipts, and 404/410 cleanup. The subscriber endpoint requires the configured application Origin and a bounded body. Delivery is at-least-once: a crash after push-service acceptance but before receipt storage may produce a duplicate. Do not claim exact-time or guaranteed receipt. Current implementation is appropriate to this small personal experience, not a general high-volume notification service.

Required setup: Upstash-compatible Redis REST database, VAPID public/private keys and mailto subject, strong CRON_SECRET, APP_ORIGIN equal to the deployed HTTPS origin. Vercel cron sends the secret bearer token automatically. The frequent schedule is not enabled in vercel.json by default so Hobby deployment is not blocked. To enable on a suitable plan, schedule /api/cron with `* 21 11 11 *`. This schedules once per minute in the 21:00 UTC hour on November 11; calls before 21:11 do nothing and later calls retry unfinished subscriptions. Frequent cron requires a suitable Vercel plan (typically Pro). Once-per-minute scheduling means dispatch may lag release; browser delivery may lag further. The handler also refuses delivery after the one-hour launch window, so an accidentally retained annual cron cannot send in later years. Disable the annual schedule after the event to avoid unnecessary invocations.

Push controls are hidden until required credentials are configured and browser APIs exist. Notification permission is requested only from a user tap. On iOS/iPadOS 16.4+, Web Push requires the installed Home Screen web app; ordinary Safari tabs do not offer this flow. Android Chrome supports Web Push on HTTPS with permission; browser/OS notification settings, focus modes, power saving, and revoked permissions can prevent delivery. Calendar remains the fallback.

**Persistent storage and background delivery have NOT been tested against live services.** Keys/database/cron are not configured here. A real subscribe → scheduled push → notification click test must pass on actual supported devices before marking background notifications working. iOS Safari/WebKit hardware verification remains blocked by missing host libraries noted in Phase 3.

## Verification and remaining launch work

Local gateway HTTP tests exercise real handlers with a test-controlled server clock: prelaunch HTML, private API/JS/assets denial, no-store headers, spoofed Date header rejection, exact-boundary release, old source archive denial, and private placeholder exclusion from built JS. Timing, placement, bouquet identity tests also run. Browser tests traverse all eleven scenes through growing/picking/wrapping/export preparation and the wish/letter, plus 320×568, 390×844, 430×932 captures of new scenes. Reviewed actual screenshots and separated game touch targets. Growth/PNG regression tests are run; production build is required.

Remaining before launch: replace placeholders, provide licensed song and real memory assets if desired, connect/deploy Vercel, configure Redis/VAPID/cron, verify live gateway routing/caching and scheduled notifications, and perform real iOS/Android checks. No claim of completed launch or background notification delivery is made.

## Server-only personalization and two audio choices

`PERSONALIZATION_JSON` can override the centralized server configuration without publishing real names, jokes or messages in the public repository. Store it as a protected Vercel environment variable, then redeploy. `letter: []` and `hiddenMessages: []` omit personal letter/hidden content. Memory entries may use `image: null`; no photograph or shared event is fabricated.

Optional `songs` contains two tracks: `{id:"calm",label:"هادي",title:"…",file:"/audio/calm.mp3",license:"…"}` and `{id:"hyper",label:"مهيبر",title:"…",file:"/audio/hyper.mp3",license:"…"}`. Use properly licensed files. Controls stay hidden until a usable licensed track exists. Switching tracks only affects the persistent audio element; it does not change scene, theme, colors, animations or game behavior. The only in-page control is “Tap to change”, which cycles tracks without pausing. Audible autoplay is attempted on mount; when browser policy blocks it, playback retries on the first click or Enter/Space interaction. Browser and operating-system audio controls remain outside the site’s control. Legacy `song` configuration is still supported. Track URLs and permission references are not supplied by default.

Upload `public/audio/calm.mp3` (هادي) and `public/audio/hyper.mp3` (مهيبر), then commit and redeploy. The server detects these nonempty files automatically, including when server-only `songs` entries have `file: null`. Explicit custom file paths take precedence. Missing tracks remain hidden. These are user-supplied files; the uploader must have permission to use them. This public GitHub repository does not keep uploaded audio private.

### Audio delivery

Built-in MP3 files are normalized to 128 kbps stereo MPEG audio without embedded
cover artwork (the `.mp3` suffix must match the actual codec). The gateway checks
launch/preview access before streaming audio, supports byte ranges (`206`),
Safari's two-byte probes, seeking, suffix requests and HEAD, and keeps no-store
headers. Open-ended ranges are delivered in chunks of at most 1 MiB instead of
buffering an entire track in a function response. Retest upload codec/size when
replacing songs. Each song keeps its own audio element and playback position;
the second track preloads after the first starts, so switching can reuse its
buffer. Browser autoplay restrictions still apply.
