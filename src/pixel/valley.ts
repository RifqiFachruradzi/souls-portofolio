// The valley between the two stone statues, pixelated, with the waterfall brought to life:
// the falling water scrolls down over the water pixels only (the rocks in it stay put), foam
// churns at the foot of the falls, mist rises, the pool shimmers and leaves fly on the wind.

import { dither, noise1, rgb, rng } from "./engine";

export type View = { x: number; y: number; w: number; h: number };

/** The base image is 240 x 243; regions below are in its pixels. */
const FALLS = { x0: 99, x1: 140, y0: 81, y1: 224 };
const SPLASH = { x0: 88, x1: 154, y0: 211, y1: 226 };
const POOL = { x0: 56, x1: 186, y0: 226, y1: 243 };

export const VIEWS: Record<"hero" | "card", View> = {
  hero: { x: 0, y: 0, w: 240, h: 243 },
  card: { x: 52, y: 58, w: 136, h: 170 },
};

const FOAM = [rgb("#ffffff"), rgb("#e4f6f8"), rgb("#bfe6ec")];
const MIST = [rgb("#d8eef0"), rgb("#a9d4dc")];
const SHIMMER = [rgb("#9fd6dc"), rgb("#d9f2f4")];
const LEAVES = [rgb("#2f5a2a"), rgb("#4f8a3a"), rgb("#7fb850"), rgb("#a9d36a")];

let basePromise: Promise<ImageData> | null = null;

export function loadValley(src: string) {
  basePromise ??= new Promise<ImageData>((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      const x = c.getContext("2d")!;
      x.drawImage(img, 0, 0);
      resolve(x.getImageData(0, 0, c.width, c.height));
    };
    img.onerror = () => {
      basePromise = null;
      reject(new Error(`could not load ${src}`));
    };
    img.src = src;
  });
  return basePromise;
}

export function createValley(ctx: CanvasRenderingContext2D, base: ImageData, view: View, leafCount: number, seed = 5) {
  const W = base.width, H = base.height;
  const src = new Uint32Array(base.data.buffer.slice(0));
  const frame = new Uint32Array(W * H);
  ctx.canvas.width = view.w;
  ctx.canvas.height = view.h;
  const out = ctx.createImageData(view.w, view.h);
  const out32 = new Uint32Array(out.data.buffer);
  const rand = rng(seed);

  const isWater = (i: number) => {
    const c = src[i], r = c & 0xff, g = (c >> 8) & 0xff, b = (c >> 16) & 0xff;
    return b > 150 && r + g + b > 480;
  };
  // per column: the water pixels top to bottom and their colours, scrolled as one ribbon
  const columns: { x: number; rows: number[]; tex: Uint32Array; speed: number; phase: number }[] = [];
  for (let x = FALLS.x0; x <= FALLS.x1; x++) {
    const rows: number[] = [];
    for (let y = FALLS.y0; y <= FALLS.y1; y++) if (isWater(y * W + x)) rows.push(y);
    if (rows.length < 8) continue;
    columns.push({
      x,
      rows,
      tex: Uint32Array.from(rows, (y) => src[y * W + x]),
      speed: 34 * (0.85 + noise1(x * 0.7, 3) * 0.35),
      phase: rand() * 40,
    });
  }

  const mist = Array.from({ length: 26 }, () => ({ x: 0, y: 0, vx: 0, vy: 0, age: 0, life: 0 }));
  const resetMist = (m: (typeof mist)[number]) => {
    m.x = SPLASH.x0 + rand() * (SPLASH.x1 - SPLASH.x0);
    m.y = SPLASH.y0 + rand() * 6;
    m.vx = (rand() - 0.5) * 6;
    m.vy = -(3 + rand() * 6);
    m.age = 0;
    m.life = 1.5 + rand() * 2.5;
  };
  mist.forEach((m) => {
    resetMist(m);
    m.age = rand() * m.life;
  });

  const leaves = Array.from({ length: leafCount }, () => ({ x: 0, y: 0, v: 0, p: 0, c: 0 }));
  const resetLeaf = (l: (typeof leaves)[number], anywhere: boolean) => {
    l.x = anywhere ? view.x + rand() * view.w : view.x - 4 - rand() * 20;
    l.y = view.y + rand() * view.h * 0.85;
    l.v = 14 + rand() * 18;
    l.p = rand() * 6.3;
    l.c = Math.floor(rand() * LEAVES.length);
  };
  leaves.forEach((l) => resetLeaf(l, true));

  const set = (x: number, y: number, c: number) => {
    x |= 0;
    y |= 0;
    if (x >= 0 && y >= 0 && x < W && y < H) frame[y * W + x] = c;
  };

  function render(t: number, dt: number) {
    frame.set(src);
    // falling water
    for (const col of columns) {
      const n = col.rows.length, off = Math.floor(t * col.speed + col.phase);
      for (let k = 0; k < n; k++) frame[col.rows[k] * W + col.x] = col.tex[(((k - off) % n) + n) % n];
      // a bright streak now and then
      const s = Math.floor((t * col.speed * 1.4 + col.phase * 7) % (n + 30));
      if (s < n && noise1(col.x * 1.3 + Math.floor(t * 0.5), 9) > 0.55) {
        frame[col.rows[s] * W + col.x] = FOAM[0];
        if (s + 1 < n) frame[col.rows[s + 1] * W + col.x] = FOAM[1];
      }
    }
    // churning foam at the foot of the falls
    for (let y = SPLASH.y0; y <= SPLASH.y1; y++)
      for (let x = SPLASH.x0; x <= SPLASH.x1; x++) {
        const edge = 1 - Math.abs(x - (SPLASH.x0 + SPLASH.x1) / 2) / ((SPLASH.x1 - SPLASH.x0) / 2);
        const k = noise1(x * 0.6 + t * 3.1 + y * 1.7, 13) * edge * (0.7 + 0.3 * Math.sin(t * 5 + x));
        if (dither(x, y + Math.floor(t * 8), k * 0.9)) set(x, y, FOAM[k > 0.6 ? 0 : k > 0.4 ? 1 : 2]);
      }
    // shimmering pool
    for (let y = POOL.y0; y < POOL.y1; y++)
      for (let x = POOL.x0; x <= POOL.x1; x++) {
        const k = noise1(x / 5 + t * 0.9 + y * 2.3, 17) * (1 - (y - POOL.y0) / (POOL.y1 - POOL.y0));
        if (k > 0.72) set(x, y, SHIMMER[k > 0.82 ? 1 : 0]);
      }
    // mist rising
    for (const m of mist) {
      m.age += dt;
      if (m.age > m.life) resetMist(m);
      m.x += m.vx * dt;
      m.y += m.vy * dt;
      if (dither(m.x | 0, m.y | 0, 1 - m.age / m.life)) set(m.x, m.y, MIST[m.age / m.life > 0.5 ? 1 : 0]);
    }
    // leaves on the wind, flipping as they spin
    const gust = 1 + 0.5 * Math.sin(t * 0.35);
    for (const l of leaves) {
      l.x += l.v * gust * dt;
      l.y += (Math.sin(t * 1.7 + l.p) * 9 + 3) * dt;
      if (l.x > view.x + view.w + 4 || l.y > view.y + view.h + 4) resetLeaf(l, false);
      const c = LEAVES[l.c], spin = Math.floor(t * 6 + l.p * 3) % 4;
      set(l.x, l.y, c);
      if (spin === 0) set(l.x + 1, l.y, c);
      else if (spin === 1) set(l.x + 1, l.y + 1, LEAVES[Math.max(0, l.c - 1)]);
      else if (spin === 2) set(l.x, l.y + 1, c);
    }
    // crop to the view
    for (let y = 0; y < view.h; y++) {
      const so = (view.y + y) * W + view.x;
      out32.set(frame.subarray(so, so + view.w), y * view.w);
    }
    ctx.putImageData(out, 0, 0);
  }

  return { render };
}
