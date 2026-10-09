# Rifqi Fachruradzi · Portfolio

A Naruto-themed portfolio for Muhammad Rifqi Fachruradzi, built with React, TypeScript, and Vite: dark Konoha
greens, Naruto-orange accents, a hand-drawn leaf mark, kanji section numbers, and shuriken dividers.

- **Hero**: the Valley of the End as a pixelated, animated background. The waterfall flows (its texture scrolls
  down over the water pixels only, so the rocks in it stay put), foam churns at its foot, mist rises, the pool
  shimmers, and leaves fly on the wind.
- **Valley of the End card**: a ninja info card with the same animated valley inside. Hover tilts it toward the
  light, dragging spins it, and double-click (or Enter / F) flips it to the profile on the back.

The background is one 23 KB pixel image (`public/scene/valley.png`, 240 x 243, 40 colours), animated on a canvas at
20 fps and scaled up with `image-rendering: pixelated`. The animation stops while offscreen or in a background tab
and stays still under `prefers-reduced-motion`.

Content mirrors [portoqiqi.vercel.app](https://portoqiqi.vercel.app) and lives in `src/data/profile.ts`.

## Sections

- **Card**: the interactive ninja info card
- **About**: summary, character sheet, and education
- **Missions**: work experience
- **Projects**: projects with live demos and source links
- **Jutsu**: skills
- **Summon**: contact links

## Code map

- `src/pixel/engine.ts`: pixel helpers (colours, ordered dithering, seeded randomness, noise).
- `src/pixel/valley.ts`: the valley animation: waterfall, foam, mist, pool, and leaves, cropped to a view.
- `src/components/PixelCanvas.tsx`: mounts the valley on a canvas and runs the loop.
- `src/components/NinjaCard.tsx`: the card, its spring-based tilt, spin, and flip.
- `src/components/LeafMark.tsx`: the leaf-and-spiral mark.

## Development

```bash
npm install
npm run dev        # local dev server
npm run build      # typecheck + production build in dist/
npm run preview    # serve dist/
```

`rollup` is pinned to 4.50.1 through `overrides`, because rollup 4.64.2 hangs while bundling `react-dom`.
