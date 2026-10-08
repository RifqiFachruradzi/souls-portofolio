# Rifqi Fachruradzi · Souls Portfolio

A Dark Souls themed portfolio for Muhammad Rifqi Fachruradzi, built with React, TypeScript, and Vite.

- **Hero**: an animated pixel-art night scene drawn in code on a `<canvas>`: a gothic cathedral under a full
  moon, red-leaved trees, a red grass field, and a lone knight with a greatsword. Stars twinkle, clouds drift,
  the moon's halo breathes, windows and lanterns flicker, grass and leaves sway in the wind, leaves fall,
  fireflies wander, the knight's cape flutters, and a glint runs up the blade now and then.
- **The Ashen One**: a pixel trading card with a smaller version of the same scene. Hover tilts it toward the
  light, dragging spins it, and double-click (or Enter / F) flips it to the profile on the back.

There are no image or model assets for the scenes, so they show immediately. They render at a low resolution
(about 320 x 180) at 20 fps, are scaled up with `image-rendering: pixelated`, stop while offscreen or in a
background tab, and draw a single still frame under `prefers-reduced-motion`.

Content mirrors [portoqiqi.vercel.app](https://portoqiqi.vercel.app) and lives in `src/data/profile.ts`.

## Sections

- **The Ashen One**: the interactive pixel card
- **Bonfire**: about, character sheet, and education
- **Journey**: work experience
- **Relics**: projects with live demos and source links
- **Attributes**: skills
- **Summon**: contact links

## Code map

- `src/pixel/engine.ts`: a tiny pixel framebuffer (layers, ordered dithering, seeded randomness, noise).
- `src/pixel/scene.ts`: the scene: layouts for landscape, portrait, and the card; static layers painted once;
  everything that moves, painted per frame.
- `src/components/PixelCanvas.tsx`: mounts a scene on a canvas sized to its host and runs the loop.
- `src/components/PixelCard.tsx`: the card, its spring-based tilt, spin, and flip.

## Development

```bash
npm install
npm run dev        # local dev server
npm run build      # typecheck + production build in dist/
npm run preview    # serve dist/
```

`rollup` is pinned to 4.50.1 through `overrides`, because rollup 4.64.2 hangs while bundling `react-dom`.
