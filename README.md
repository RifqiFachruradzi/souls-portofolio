# Rifqi Fachruradzi · Portfolio

A Naruto-themed portfolio for Muhammad Rifqi Fachruradzi, built with React, TypeScript, and Vite: dark Konoha
greens, Naruto-orange accents, a hand-drawn leaf mark, kanji section numbers, and shuriken dividers.

The whole page sits on the Valley of the End, pixelated and animated, fixed behind every section: the waterfall
flows (its texture scrolls down over the water pixels only, so the rocks in it stay put), foam churns at its foot,
mist rises, the pool shimmers, and leaves fly on the wind. A veil over it deepens as you scroll, so the valley is
vivid behind the hero and dimmer under the sections, where text needs to stay legible.

The background is one 23 KB pixel image (`public/scene/valley.png`, 240 x 243, 40 colours), animated on a canvas at
20 fps and scaled up with `image-rendering: pixelated`. The animation stops while offscreen or in a background tab
and stays still under `prefers-reduced-motion`.

Content mirrors [portoqiqi.vercel.app](https://portoqiqi.vercel.app) and lives in `src/data/profile.ts`.

## Sections

- **About**: summary, character sheet, and education
- **Missions**: work experience
- **Projects**: projects with live demos and source links
- **Jutsu**: skills
- **Summon**: contact links

## Code map

- `src/pixel/engine.ts`: pixel helpers (colours, ordered dithering, seeded randomness, noise).
- `src/pixel/valley.ts`: the valley animation: waterfall, foam, mist, pool, and leaves, cropped to a view.
- `src/components/PixelCanvas.tsx`: mounts the valley on a canvas and runs the loop.
- `src/components/ValleyBackground.tsx`: the fixed full-page background and its scroll veil.
- `src/components/LeafMark.tsx`: the leaf-and-spiral mark.
- `src/motion.ts`: entrance motion with [anime.js](https://animejs.com) v4: the hero intro (scrambled location,
  rising letters, a settling surname), section titles whose letters rise as a shuriken spins in, and skill counts
  that tick up. All of it is skipped under `prefers-reduced-motion`.

## Development

```bash
npm install
npm run dev        # local dev server
npm run build      # typecheck + production build in dist/
npm run preview    # serve dist/
```

`rollup` is pinned to 4.50.1 through `overrides`, because rollup 4.64.2 hangs while bundling `react-dom`.
