// A tiny pixel framebuffer: every layer is a Uint32Array of ABGR pixels (0 = transparent),
// composited by copying, then pushed to a canvas that CSS scales up with `pixelated`.

export type Color = number;

/** `#rrggbb` → ABGR uint32 as stored by ImageData on little-endian machines. */
export function rgb(hex: string): Color {
  const n = parseInt(hex.slice(1), 16);
  return ((0xff << 24) | ((n & 0xff) << 16) | (n & 0xff00) | ((n >> 16) & 0xff)) >>> 0;
}

export class Layer {
  readonly data: Uint32Array;

  constructor(readonly w: number, readonly h: number) {
    this.data = new Uint32Array(w * h);
  }

  set(x: number, y: number, c: Color) {
    x |= 0;
    y |= 0;
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
    this.data[y * this.w + x] = c;
  }

  get(x: number, y: number): Color {
    x |= 0;
    y |= 0;
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return 0;
    return this.data[y * this.w + x];
  }

  rect(x: number, y: number, w: number, h: number, c: Color) {
    const x0 = Math.max(0, x | 0), y0 = Math.max(0, y | 0);
    const x1 = Math.min(this.w, (x + w) | 0), y1 = Math.min(this.h, (y + h) | 0);
    for (let yy = y0; yy < y1; yy++) this.data.fill(c, yy * this.w + x0, yy * this.w + x1);
  }

  /** Copies the opaque pixels of `src` onto this layer at an integer offset. */
  blit(src: Layer, dx = 0, dy = 0) {
    dx |= 0;
    dy |= 0;
    const x0 = Math.max(0, dx), y0 = Math.max(0, dy);
    const x1 = Math.min(this.w, dx + src.w), y1 = Math.min(this.h, dy + src.h);
    for (let y = y0; y < y1; y++) {
      const so = (y - dy) * src.w - dx, o = y * this.w;
      for (let x = x0; x < x1; x++) {
        const c = src.data[so + x];
        if (c) this.data[o + x] = c;
      }
    }
  }
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

export function fillCircle(layer: Layer, cx: number, cy: number, r: number, c: Color) {
  for (let y = Math.floor(cy - r); y <= Math.ceil(cy + r); y++)
    for (let x = Math.floor(cx - r); x <= Math.ceil(cx + r); x++)
      if ((x - cx) ** 2 + (y - cy) ** 2 <= r * r) layer.set(x, y, c);
}

/** A line `width` pixels thick, stamped with squares along its length. */
export function thickLine(layer: Layer, x0: number, y0: number, x1: number, y1: number, w0: number, w1: number, c: Color) {
  const steps = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0)));
  for (let i = 0; i <= steps; i++) {
    const t = i / steps, w = w0 + (w1 - w0) * t;
    const x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t;
    layer.rect(Math.round(x - w / 2), Math.round(y - w / 2), Math.max(1, Math.round(w)), Math.max(1, Math.round(w)), c);
  }
}
