# Benayaram Rekha — Portfolio

A complete rebuild of the original React portfolio: Next.js 15 App Router,
React 19, TypeScript, Tailwind CSS 4, self-hosted fonts, Lenis, and Nodemailer.
The original site remains in Git history. Work branch: `codex/portfolio-rebuild`.

## Run locally

Use Node.js 22.18+ or 24 LTS.

```sh
npm install
npm run dev
```

Open http://localhost:3000. Production:

```sh
npm run build
npm start
```

This site needs a **Node.js host** for the contact endpoint. The original GitHub
Pages deployment command was removed because GitHub Pages cannot run Nodemailer.
No site has been published by this rebuild.

## Content and provenance

Edit `src/lib/data.ts` for profile, social links, skills, experience, education,
projects, certifications, and achievements. Do not add invented metrics or URLs.

- Primary source: the supplied three-page `Benayaram_Rekha - Flutter.pdf`.
- Summary preserves the resume wording, normalizing PDF extraction whitespace.
- Additional school, intermediate, trainer, course, and hackathon details came
  directly from the user's request.
- Senior internship dates follow the certificate, **as confirmed by the user**:
  August–December 2024 and February–April 2025. The resume's Jan–Jun 2025 dates
  are superseded on the website; the downloadable resume itself is unchanged.
- Trainer organization uses the user's “Tech Leads” spelling; the resume has
  “Tech Teads.” Jun–Dec 2023 comes from the resume.
- B.Tech has no grade in the supplied resume, so no CGPA is shown.
- GitHub and LinkedIn are embedded resume links. YouTube and the FBGL repository
  URL were retained from the existing portfolio. No other project repos inferred.
- TEGA and FBGL Play Store links were supplied by the user. HRM and AO CRM show
  a disabled **Not available** button until their `live` values are added.
- Six certifications are listed. Only the supplied internship certificate has
  a view link. Dates and links for the other certificates are not invented.
- Project artwork and portrait are user-supplied and displayed in their original
  colors. The page uses a warm cream canvas with charcoal text and blue, teal, and
  amber accents; clicking a project image opens the supplied artwork directly.
- Decorative ID/barcode are presentation only. No invented employee ID or expiry.
- The hero video fills the entire section with no shaped frame. The full landscape source is used, with responsive cover positioning and overlaid content.

## Sections

| Order | Section | Interaction |
| --- | --- | --- |
| Hero | Video introduction and resume | Muted fallback, sound control, offscreen pause |
| 01 | About | Spring-damped lanyard; hover, tap, Enter/Space flip |
| 02 | Skills | Periodic table, family filters, hover/focus/tap inspector |
| 03 | Work | Expanding project panels; vertical mobile accordion |
| 04 | Certifications | Ink-fill rows; supplied certificate link |
| 05 | Experience | Chronological education and work; scroll-drawn spine |
| 06 | Achievements | Sticky horizontal desktop gallery; touch/keyboard scroll fallback |
| 07 | Contact | Copy email, social profiles, Nodemailer form, footer |

Reduced motion disables decorative movement and autoplay, and converts the
achievement gallery to manual scrolling. The mobile menu traps focus, supports
Escape, and locks background scrolling. Visible text remains available without
scroll animation. All assets are local; no runtime image CDN or font service.

## Connect the contact form

Copy `.env.example` to `.env.local` and set:

```dotenv
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-mail-account
SMTP_PASS=your-app-password
SMTP_FROM=your-verified-sender@example.com
CONTACT_TO=benayaramcreations@gmail.com
SITE_URL=https://your-portfolio-domain.example
TRUST_PROXY=false
```

Use credentials appropriate to your provider (for Gmail, an app password).
For port 587, use `SMTP_SECURE=false`; Nodemailer negotiates STARTTLS when offered.
Never expose SMTP values through `NEXT_PUBLIC_*`, source files, or Git. Restart
after changing environment values. Set `SITE_URL` at build and runtime to your
real origin for social image metadata and the same-origin form check.

The endpoint accepts JSON only, validates and bounds input, rejects header
injection and a honeypot, and sends plain-text email from the configured sender
with the visitor as `Reply-To`. Errors never expose credentials. With no SMTP
configuration, it returns HTTP 503 and offers the direct email link; it never
claims a message was sent.

Rate limiting is an in-memory 5-attempt/10-minute window. By default requests
share a conservative bucket. Set `TRUST_PROXY=true` only behind a trusted reverse
proxy that **replaces** incoming `X-Forwarded-For`. For multiple instances or
serverless production, configure a shared rate-limit store or host-level abuse
protection; in-memory state is per process and resets on restart.

## Rebuild media

Python 3, NumPy, Pillow, ffmpeg, and ffprobe are needed only for asset preparation.
The generated assets are committed, so these tools are not needed to run the site.

```sh
python -m pip install numpy pillow
python scripts/build-hero-assets.py /path/to/intro.mp4 --crop 1280:720:0:0
python scripts/prepare-assets.py --source /path/to/Resume --portrait /path/to/photo.png
```

The hero script uses the full supplied source by default, preserves the full 1280×720 landscape
composition, scales to 1280 px, whitens levels, and overlaps picture and stereo
audio by 0.5 seconds. The resulting loop is the complete source duration minus the cross-fade overlap. Audio is blended
sample-by-sample in NumPy, not ffmpeg `acrossfade`; picture and audio use matching
trim positions. No speed changes or audio stretching are applied. H.264/AAC MP4
uses CRF 24 and faststart; VP9/Opus WebM uses CRF 36. The still poster is extracted
from the resulting clip. `--start`, `--seconds`, `--fade`, and `--crop` are editable.
For a different source, inspect a frame and provide suitable crop coordinates.
This script does not claim to detect a person automatically.

The preparation script makes the 480×600 portrait, project thumbnails, and
1200×630 sharing image. The original input video is not duplicated in the repo.

## Checks

```sh
npm run lint
npm run typecheck
npm test
npm run build
# Start the production app on 127.0.0.1:3000 before browser checks:
npm start -- --hostname 127.0.0.1
npm run test:e2e
# Separate local SMTP sink and application instance; sends no external mail:
node scripts/check-contact.mjs
```

Browser checks use installed Chrome (override `BROWSER_CHANNEL` with `msedge`).
`TEST_URL` defaults to http://127.0.0.1:3000. Screenshots and reports are saved in
`tmp/qa/` at 1440×900, 390×844, 360×800, and 1920×1080. Tests cover overflow,
navigation, keyboard controls, project states, reduced motion, media playback,
and WCAG A/AA automated checks. Manual visual review complements automation.

`npm run test:lighthouse` writes desktop and mobile Lighthouse reports to the
same directory. `npm run format` formats the source. Component styles live in
their own `<style>` tags inside `@layer components`; shared tokens, resets,
responsive overrides, and motion preferences live in `src/app/globals.css`.

## Credits and licenses

- Inter Tight and Instrument Serif: Google Fonts / Fontsource, SIL Open Font
  License. JetBrains Mono: JetBrains / Fontsource, SIL Open Font License.
  Font license texts are included in `src/fonts/`.
- Brand SVGs: [Devicon v2.17.0](https://github.com/devicons/devicon/tree/v2.17.0),
  MIT license in `public/logos/LICENSE`. Trademarks belong to their owners and
  identify technologies used, without implying endorsement.
- Concept icons are original, simple line paths in `TechLogo.tsx`.
- User-supplied resume, photograph, video, certificate, and project artwork remain
  the property of their respective owners; no third-party stock imagery used.
- Technical references: [Next.js](https://nextjs.org/docs),
  [Nodemailer SMTP](https://nodemailer.com/smtp), [Lenis](https://github.com/darkroomengineering/lenis).
