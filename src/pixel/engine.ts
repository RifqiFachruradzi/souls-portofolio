// Small helpers for drawing in pixels: ABGR colours, ordered dithering, seeded randomness, noise.

/** `#rrggbb` → ABGR uint32 as stored by ImageData on little-endian machines. */
export function rgb(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return ((0xff << 24) | ((n & 0xff) << 16) | (n & 0xff00) | ((n >> 16) & 0xff)) >>> 0;
}

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

/** Ordered dithering: true where a pixel of coverage `t` (0..1) should be drawn. */
export function dither(x: number, y: number, t: number) {
  return t > (BAYER[((y & 3) << 2) | (x & 3)] + 0.5) / 16;
}

export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Smooth 1D value noise in 0..1. */
export function noise1(x: number, seed = 0) {
  const h = (i: number) => {
    let n = (i * 374761393 + seed * 668265263) | 0;
    n = Math.imul(n ^ (n >>> 13), 1274126177);
    return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
  };
  const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f);
  return h(i) * (1 - u) + h(i + 1) * u;
}
