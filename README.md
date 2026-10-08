# Rifqi Fachruradzi · Souls Portfolio

A Dark Souls themed portfolio for Muhammad Rifqi Fachruradzi, built with React, TypeScript, and Vite. It is built
around ThreeUI's **Dark Souls Holo Card** ("The Ashen One" variant), a Three.js r180 scene with custom GLSL:

- **Hero**: the candlelit sword shrine from that scene plays as an animated, non-interactive background.
- **The Ashen One**: the holographic card itself, in its own section before About. Hover to tilt it, drag to rotate
  it, and double-click (or press `F`) to flip it.

Content mirrors [portoqiqi.vercel.app](https://portoqiqi.vercel.app) and lives in `src/data/profile.ts`.

## Sections

- **The Ashen One**: the interactive holo card
- **Bonfire**: about, character sheet, and education
- **Journey**: work experience
- **Relics**: projects with live demos and source links
- **Attributes**: skills
- **Summon**: contact links

## ThreeUI sources

The card is integrated from ThreeUI's registered source bundle, vendored byte for byte:

| File | Role | SHA-256 |
| --- | --- | --- |
| `src/shaders/dark-souls-holo-card/DarkSoulsHoloCard.tsx` | component | `8ec70d08f25b…` |
| `public/landing-pages/dark-souls-holo-card.html` | canonical source | `4373734e87a1…` |
| `public/landing-pages/dark-souls-holo-card-cindermane.html` | variant source | `a34740e88106…` |
| `src/shaders/threeui.css` | shared style | `efe4447139f1…` |

### Shrine background

`public/landing-pages/shrine-background.html` is a small wrapper, not a copy. It fetches the canonical document
untouched and writes it into its frame with an addendum that hides the card group and the overlay text, so only the
shrine remains. It reports readiness to the page with `postMessage`, and the page pauses it (through the scene's
own `state.frozen` / `resume()`) while the hero is offscreen. The frame is sandboxed like the card, so
`/landing-pages/*` is served with `Access-Control-Allow-Origin: *` (`vercel.json`, plus a Vite plugin for
dev/preview).

`@designcodeio/threeui` and `@designcodeio/threeui/style.css` are aliased to these files in `vite.config.ts`, so
the configured usage in `src/components/Scene.tsx` works unchanged. The card document loads three.js from
`cdn.jsdelivr.net` at runtime.

Check the hashes with `sha256sum` against the values above.

## Development

```bash
npm install
npm run dev        # local dev server
npm run build      # typecheck + production build in dist/
npm run preview    # serve dist/
```

`rollup` is pinned to 4.50.1 through `overrides`, because rollup 4.64.2 hangs while bundling `react-dom`.
