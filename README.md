# Birthday Friendship Website

A cinematic birthday website celebrating a special friendship through a story-driven experience, interactive moments, hidden surprises, and heartfelt messages.

## Features

- immersive multi-phase storytelling layout
- custom timeline and memory sections
- photo gallery and memory cards
- voice message support
- interactive gift box reveal
- cake section with microphone-controlled candle blowing
- ambient background music with automatic ducking
- hidden easter eggs and confetti moments
- password-protected access for private content

## Custom Features

This project includes several unique interactive touches designed specifically for a personal birthday surprise:

- Floating animated hearts, sparkles, and ambient background effects
- A cinematic two-phase experience with a boss-style finale section
- Hidden Konami-code easter egg for bonus content
- Moon and heart interaction triggers that reveal secret notes
- Gift box animation that opens into a typed letter experience
- Real photo-inspired cake section with candle-blowing interaction
- Ambient music player that automatically lowers volume when voice messages play
- Smooth scroll-based storytelling with a polished, emotional visual style
- Fully content-driven setup so text, photos, and music can be swapped without editing the app code

## Tech Stack

- Next.js 15
- React 18
- TypeScript
- Tailwind CSS
- Howler.js
- Framer Motion
- canvas-confetti
- Lenis

## Project Structure

```bash
birthday-wishes-site-main/
├── app/
│   ├── api/
│   ├── (protected)/
│   └── login/
├── components/
├── context/
├── data/
├── hooks/
├── lib/
├── public/
├── styles/
├── middleware.ts
├── next.config.js
├── package.json
├── tsconfig.json
├── README.md
└── .env.local
```

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create a local environment file:

```bash
cp .env.local.example .env.local
```

If there is no `.env.local.example`, create it manually with:

```env
SITE_PASSWORD=your_password_here
SESSION_SECRET=your_random_secret_here
```

3. Run the app:

```bash
npm run dev
```

4. Open your browser at:

```bash
http://localhost:3000
```

## Production Build

```bash
npm run build
npm run start
```

## Customization

Most content is controlled from the single file:

- `data/content.json`

This file contains your:

- hero text
- story slides
- timeline entries
- reasons
- gallery items
- audio sources
- gift letter content
- ending copy

You can also replace media in:

- `public/photos/`
- `public/audio/`

## Password Protection

This project includes a real server-side password gate using Next.js middleware and signed cookies.

Required environment variables:

- `SITE_PASSWORD`
- `SESSION_SECRET`

These should be set in your deployment environment and kept private.

## Deployment

This app is designed for a server runtime, so deployment on platforms like:

- Vercel
- Netlify
- self-hosted Node environments

is recommended.

## Notes

The sample assets included in this project are for personal purposes and may need to be replaced with your own photos, songs, and text before publishing publicly.

## License

This project has been customized for personal use as a birthday surprise.
