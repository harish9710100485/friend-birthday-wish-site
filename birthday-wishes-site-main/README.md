# Ten years of friendship

# A friendship time capsule

An interactive, scroll-driven birthday website celebrating a decade of friendship — a cinematic "chapters" experience (story, timeline, reasons, gallery, voice message, gift, cake, ending) instead of a static card. Built as a fully reusable template: every word of text, every photo, and every audio file is swapped through a single JSON file.

**Live building blocks**: floating hearts/butterflies/sparkles background, a gift box that pops open into a hand-typed letter, a real photo cake with candles you can blow out via microphone (or a button), a hidden Konami-code easter egg, moon/heart tap-to-reveal secret notes, and a persistent ambient music player that ducks automatically when a voice message plays.

## Tech stack

- **Next.js 15** (App Router) + **React 18** + **TypeScript**
- **Tailwind CSS v4**
- **Howler.js** — audio playback (ambient music + voice message), with autoplay-unlock and mutual ducking handled for you
- **canvas-confetti** — celebration bursts
- **Lenis** — smooth scrolling

## Quick start

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Edits to `data/content.json` and any component hot-reload instantly.

```bash
npm run build   # production build
npm run start   # serve the production build
```

## How it works

Every section is its own component in `components/` (`StorySection`, `Timeline`, `ReasonsSection`, `PolaroidGallery`, `VoiceMessage`, `GiftBox`, `CakeSection`, `Ending`, plus ambient decoration components like `FloatingHearts`/`AmbientBackground`/`EasterEggs`). Each component imports `data/content.json` and renders whichever slice of it belongs to that chapter — no component hardcodes any copy, image path, or audio path.

`app/(protected)/page.tsx` assembles the chapters in order and drives the intro loading sequence. `context/InteractiveProvider.tsx` owns shared state that multiple components need — confetti, the Konami-code listener, and the single ambient-audio `Howl` instance (so the hero panel and the floating mini-player button both control the same track, and voice-message playback can duck/restore it).

It lives in a `(protected)` route group on purpose — that's the boundary the password gate sits in front of (see below).

## Customizing everything: `data/content.json`

This is the only file you need to touch to make the site yours. Structure:

| Key | Drives |
|---|---|
| `site` | Page `<title>` / meta description |
| `hero` | Loading sequence messages, title, subtitle, background music (`audioSrc`) |
| `story` | "Our Story" chapter — add as many `slides` as you want |
| `timeline` | Dated milestones — add as many `entries` as you want, `photo` is optional (`null` to omit) |
| `reasons` | Swipeable "reasons you're amazing" cards — add as many `items` as you want, `tag` is optional |
| `gallery` | Swipeable photo carousel — add as many `photos` as you want |
| `voice` | Voice-message chapter, including its own `audioSrc` |
| `gift` | Gift-box chapter — `letterText` is what types out after the box opens (use `\n\n` for paragraph breaks) |
| `cake` | Candle-blow chapter — `image` is the cake photo path |
| `ending` | Final closing message |
| `easterEggs` | Text shown by the hidden moon/heart taps |

Every list (`slides`, `entries`, `items`, `photos`) is rendered by mapping over the array — there's no hardcoded limit, add as few or as many as you like.

**Photos**: drop image files into `public/photos/` and point any `"src"`/`"photo"`/`"image"` field at `/photos/yourfile.jpg`.

**Audio**: drop files into `public/audio/` and point `hero.audioSrc` / `voice.audioSrc` at `/audio/yourfile.mp3`.

## Password gate (real, server-side)

The whole experience sits behind a password screen enforced by **Next.js Middleware** (`middleware.ts`), not client-side JavaScript. On every request — the page itself, its JS bundle, and any file under `/photos` or `/audio` — the middleware checks a signed session cookie before anything is served. No cookie, or an invalid one, and the request never reaches the protected route at all; it's redirected to `/login` at the edge. Nothing personal ever ships to an unauthenticated browser — not the story text, not the photo filenames, not a password.

How it works:

- `app/login/page.tsx` — the password form (copy configurable via `data/gate.json`: title, subtitle, hints, etc. — no secrets in this file, safe to keep in the repo)
- `app/api/login/route.ts` — checks the submitted password against the `SITE_PASSWORD` environment variable server-side, and on success signs a session cookie using `SESSION_SECRET` (HMAC-SHA256, 30-day expiry)
- `middleware.ts` — verifies that cookie's signature on every request; redirects to `/login` if missing or invalid
- `app/(protected)/` — route group holding the real site; everything in here (and every static file) is what the middleware guards

**Setup**: set two environment variables wherever you deploy —

| Variable | Purpose |
|---|---|
| `SITE_PASSWORD` | The password itself. Never appears in code or the client bundle. |
| `SESSION_SECRET` | Random string used to sign session cookies — generate one with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |

On Vercel: `vercel env add SITE_PASSWORD production` and `vercel env add SESSION_SECRET production` (repeat for `preview` if you use preview deployments), or set them in the dashboard under Project Settings → Environment Variables. Locally, put them in `.env.local` (already gitignored).

**Why this needs a real server**: middleware and API routes only run where Next.js has a server runtime (Vercel, Netlify, self-hosted Node). This means the template can no longer be exported as static files — see below.

## Deploying

Real auth requires a server runtime, so **static export (GitHub Pages) is no longer supported** — Next.js hard-errors if middleware exists alongside `output: 'export'`. Deploy to a platform that runs Next.js server-side:

- **Vercel** — connect the repo, add the two env vars above, done.
- **Netlify** — connect the repo, auto-detected, add the two env vars in site settings.

If you don't need real privacy and would rather have zero-server static hosting back (e.g. GitHub Pages), delete `middleware.ts`, `app/api/login/`, `app/login/`, and the `(protected)` route group split, and re-add `output: 'export'` to `next.config.js` — you're back to a fully static template, just without password protection.

## A note on the sample content

This repo ships with the `data/content.json`, cake photo, and audio files I used for my own version of this site so it works out of the box as a working example — they are **not original creations of this repository's author** (the photo and songs belong to their respective photographers/artists/labels). They're included purely to demonstrate the template end-to-end.

If you are the rights holder of any included image or audio file and would like it removed, please open an issue and I will take it down promptly.

If you're forking this to build your own version, swap every file in `public/photos/` and `public/audio/`, and rewrite `data/content.json`, before sharing your version publicly.
