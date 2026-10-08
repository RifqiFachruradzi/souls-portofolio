// Moonlit cathedral, red-leaved trees, a red grass field and a lone knight with a greatsword,
// drawn in pixels and animated: twinkling stars, drifting clouds, a breathing moon halo,
// flickering windows and lanterns, swaying grass and foliage, falling leaves, fireflies,
// a fluttering cape and the occasional glint running up the blade.

import { Layer, dither, noise1, rgb, rng, thickLine, type Color } from "./engine";

export type SceneVariant = "hero" | "card";

const P = {
  sky0: rgb("#0a0e1c"),
  sky1: rgb("#141c33"),
  sky2: rgb("#22304f"),
  sky3: rgb("#33456a"),
  sky4: rgb("#4a5d84"),
  starDim: rgb("#6f7ea6"),
  star: rgb("#c9d3f0"),
  starHot: rgb("#ffffff"),
  moon: rgb("#f1e6c6"),
  moonShade: rgb("#d9c9a1"),
  moonCrater: rgb("#c8b68c"),
  halo0: rgb("#5b6c95"),
  halo1: rgb("#8796ba"),
  cloudShadow: rgb("#253150"),
  cloud: rgb("#3c4b70"),
  cloudLit: rgb("#6c7ea6"),
  cloudRim: rgb("#a7b5d4"),
  hill: rgb("#161d2f"),
  hillNear: rgb("#11172a"),
  cath: rgb("#10141f"),
  cathLit: rgb("#222b42"),
  cathRim: rgb("#323e5c"),
  cathDark: rgb("#0b0e17"),
  window: rgb("#07090f"),
  glow0: rgb("#8a4a1c"),
  glow1: rgb("#e0913a"),
  glow2: rgb("#ffd38a"),
  fog: rgb("#2a3550"),
  ground: rgb("#0e0d15"),
  groundTex: rgb("#17141f"),
  trunk: rgb("#0d0a10"),
  trunkLit: rgb("#251b24"),
  leaf0: rgb("#3f0b10"),
  leaf1: rgb("#7a1519"),
  leaf2: rgb("#b02a28"),
  leaf3: rgb("#e0503f"),
  grass: [rgb("#3a0a0f"), rgb("#5e1016"), rgb("#8c1a1e"), rgb("#b82a27"), rgb("#de4636")],
  outline: rgb("#07070c"),
  armor0: rgb("#1a1d2a"),
  armor1: rgb("#2e3447"),
  armor2: rgb("#4f5a78"),
  armor3: rgb("#8592b5"),
  horn: rgb("#c7b48a"),
  hornShade: rgb("#7c6c4c"),
  cape0: rgb("#120c17"),
  cape1: rgb("#21172a"),
  cape2: rgb("#3a2a48"),
  steel0: rgb("#5d6680"),
  steel1: rgb("#a3aec8"),
  steel2: rgb("#eef3ff"),
  gold0: rgb("#7a5a22"),
  gold1: rgb("#c99f45"),
  leather: rgb("#3a281c"),
  fly0: rgb("#7a5418"),
  fly1: rgb("#f7d77a"),
};

type Layout = {
  W: number;
  H: number;
  horizon: number;
  ground: number;
  moon: { x: number; y: number; r: number };
  cath: { x: number; s: number };
  knight: { x: number; y: number; s: number };
  treeL: boolean;
  treeR: boolean;
  stars: number;
  clouds: number;
  leaves: number;
  flies: number;
};

function layoutFor(variant: SceneVariant, aspect: number): Layout {
  if (variant === "card") {
    const W = 60, H = 84;
    return {
      W, H, horizon: 58, ground: 64,
      moon: { x: 41, y: 17, r: 8 },
      cath: { x: 20, s: 0.36 },
      knight: { x: 34, y: 76, s: 1 },
      treeL: false, treeR: false, stars: 18, clouds: 2, leaves: 3, flies: 3,
    };
  }
  if (aspect < 1.05) {
    // portrait: everything gathers in the upper part, the field runs down under the text
    const W = 160, H = Math.round(Math.min(380, Math.max(170, W / aspect)));
    const horizon = Math.round(H * 0.34);
    return {
      W, H, horizon, ground: horizon + 6,
      moon: { x: 96, y: Math.round(H * 0.12), r: 15 },
      cath: { x: 58, s: 0.62 },
      knight: { x: 118, y: horizon + 18, s: 1 },
      treeL: true, treeR: false, stars: 60, clouds: 5, leaves: 10, flies: 10,
    };
  }
  // landscape: the scene sits left of centre; the right half stays calm for the hero text
  const H = 180, W = Math.round(Math.min(440, Math.max(240, H * aspect)));
  return {
    W, H, horizon: 128, ground: 134,
    moon: { x: Math.round(W * 0.43), y: 44, r: 20 },
    cath: { x: Math.round(W * 0.3), s: 0.82 },
    knight: { x: Math.round(W * 0.45), y: 150, s: 1 },
    treeL: true, treeR: true, stars: 110, clouds: 6, leaves: 22, flies: 16,
  };
}

// ---------- static layers ----------

function paintSky(L: Layout, rand: () => number) {
  const sky = new Layer(L.W, L.H);
  const bands = [P.sky0, P.sky1, P.sky2, P.sky3, P.sky4];
  for (let y = 0; y < L.horizon + 4; y++) {
    for (let x = 0; x < L.W; x++) {
      // vertical gradient, lifted around the moon
      const dm = Math.hypot(x - L.moon.x, (y - L.moon.y) * 1.2) / (L.moon.r * 5.5);
      let t = (y / (L.horizon + 4)) * 3.2 + Math.max(0, 1 - dm) * 0.8;
      t = Math.min(bands.length - 1.001, t);
      const i = Math.floor(t);
      sky.set(x, y, dither(x, y, t - i) ? bands[i + 1] : bands[i]);
    }
  }
  const stars: { x: number; y: number; p: number; s: number }[] = [];
  for (let i = 0; i < L.stars; i++) {
    const x = Math.floor(rand() * L.W), y = Math.floor(rand() * L.horizon * 0.72);
    if (Math.hypot(x - L.moon.x, y - L.moon.y) < L.moon.r * 2.2) continue;
    stars.push({ x, y, p: rand() * Math.PI * 2, s: 0.6 + rand() * 1.8 });
  }
  return { sky, stars };
}

function paintMoon(L: Layout) {
  const { x: cx, y: cy, r } = L.moon;
  const moon = new Layer(L.W, L.H);
  for (let y = Math.floor(cy - r); y <= cy + r; y++)
    for (let x = Math.floor(cx - r); x <= cx + r; x++) {
      const dx = x - cx, dy = y - cy, d = Math.hypot(dx, dy);
      if (d > r) continue;
      // light from the upper right; the lower left falls into a dithered shade
      const shade = (-dx * 0.7 + dy * 0.7) / r;
      moon.set(x, y, shade > 0.35 && dither(x, y, (shade - 0.35) * 1.6) ? P.moonShade : P.moon);
    }
  const craters: [number, number, number][] = [[-0.32, -0.22, 0.16], [0.22, 0.18, 0.11], [-0.08, 0.45, 0.08]];
  for (const [ox, oy, rr] of craters) {
    const ccx = cx + ox * r, ccy = cy + oy * r, crr = Math.max(1, rr * r);
    for (let y = Math.floor(ccy - crr); y <= ccy + crr; y++)
      for (let x = Math.floor(ccx - crr); x <= ccx + crr; x++)
        if (Math.hypot(x - ccx, y - ccy) <= crr && moon.get(x, y) && dither(x, y, 0.4)) moon.set(x, y, P.moonCrater);
  }
  return moon;
}

function paintCloud(w: number, h: number, rand: () => number) {
  const mask = new Uint8Array(w * h);
  const puffs = 4 + Math.floor(rand() * 5);
  for (let i = 0; i < puffs; i++) {
    const px = w * (0.12 + 0.76 * (i + rand() * 0.6) / puffs), r = h * (0.28 + rand() * 0.32);
    const py = h - r - 1 - rand() * h * 0.15;
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++) if ((x - px) ** 2 + ((y - py) * 1.25) ** 2 <= r * r) mask[y * w + x] = 1;
  }
  // a flat base, like the banks in the reference
  for (let x = Math.floor(w * 0.08); x < w * 0.92; x++) for (let y = h - 3; y < h; y++) mask[y * w + x] = 1;
  const layer = new Layer(w, h);
  const on = (x: number, y: number) => x >= 0 && y >= 0 && x < w && y < h && mask[y * w + x] === 1;
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      if (!on(x, y)) continue;
      let c = P.cloud;
      if (!on(x, y - 1)) c = P.cloudRim;
      else if (!on(x, y - 2) || (!on(x, y - 3) && dither(x, y, 0.5))) c = P.cloudLit;
      else if (!on(x, y + 2) || (y > h * 0.7 && dither(x, y, 0.45))) c = P.cloudShadow;
      layer.set(x, y, c);
    }
  return layer;
}

function paintCathedral(layer: Layer, L: Layout, rand: () => number) {
  const s = L.cath.s, base = L.horizon + 1, cx = L.cath.x;
  const windows: { x: number; y: number; p: number }[] = [];
  const S = (v: number) => Math.round(v * s);
  // silhouette mask, then lit right edges
  const body = new Layer(L.W, L.H);
  const towers = [
    { dx: 0, w: 16, h: 92, spire: 38 },
    { dx: -20, w: 11, h: 70, spire: 26 },
    { dx: 20, w: 11, h: 74, spire: 26 },
    { dx: -36, w: 8, h: 50, spire: 18 },
    { dx: 35, w: 8, h: 52, spire: 18 },
    { dx: -50, w: 6, h: 32, spire: 12 },
    { dx: 50, w: 6, h: 36, spire: 13 },
  ];
  // nave and aisles
  body.rect(cx + S(-54), base - S(24), S(108), S(24), P.cath);
  body.rect(cx + S(-30), base - S(44), S(60), S(44), P.cath);
  for (let i = 0; i <= S(30); i++) body.rect(cx + S(-30) + i, base - S(44) - Math.round(i * 0.4), S(60) - 2 * i, 1, P.cath);
  for (const t of towers) {
    const x0 = cx + S(t.dx) - Math.round(S(t.w) / 2), w = Math.max(3, S(t.w)), top = base - S(t.h);
    body.rect(x0, top, w, base - top, P.cath);
    const sp = S(t.spire);
    for (let i = 0; i < sp; i++) {
      const half = (w / 2) * (1 - i / sp);
      body.rect(Math.round(x0 + w / 2 - half), top - i, Math.max(1, Math.round(half * 2)), 1, P.cath);
    }
    body.set(Math.round(x0 + w / 2 - 0.5), top - sp - 1, P.cath);
    // corner pinnacles
    for (const px of [x0, x0 + w - 1]) for (let i = 1; i <= Math.max(2, S(7)); i++) body.set(px, top - i, P.cath);
    // tall pointed windows down the tower
    if (w >= 5) {
      for (let wy = top + S(8); wy < base - S(10); wy += Math.max(6, S(11))) {
        const wx = Math.round(x0 + w / 2) - 1, wh = Math.max(3, S(7));
        windows.push({ x: wx, y: wy, p: rand() });
        for (let i = 0; i < wh; i++) {
          body.set(wx, wy + i, P.window);
          if (i > 0) body.set(wx + 1, wy + i, P.window);
        }
      }
    }
  }
  // rose window on the central tower
  const ry = base - S(70), rr = Math.max(1.5, S(4));
  for (let y = -rr; y <= rr; y++)
    for (let x = -rr; x <= rr; x++) if (x * x + y * y <= rr * rr) body.set(cx + x, ry + y, P.window);
  windows.push({ x: cx, y: ry, p: rand() });
  // spikes along every roof line
  for (let x = cx + S(-54); x < cx + S(54); x += 2) {
    let y = 0;
    while (y < L.H && !body.get(x, y)) y++;
    if (y < base - 2 && rand() < 0.55) for (let i = 1; i <= 1 + Math.floor(rand() * 3); i++) body.set(x, y - i, P.cath);
  }
  // flying buttresses
  for (const side of [-1, 1])
    for (let i = 0; i < 3; i++) {
      const x0 = cx + side * S(14 + i * 13), y0 = base - S(60 - i * 12), x1 = cx + side * S(24 + i * 13), y1 = base - S(28 - i * 4);
      thickLine(body, x0, y0, x1, y1, 1, 1, P.cath);
    }
  // shading: right edges catch the moon, left edges sink
  for (let y = 0; y < L.H; y++)
    for (let x = 0; x < L.W; x++) {
      const c = body.get(x, y);
      if (!c) continue;
      if (c === P.window) {
        layer.set(x, y, c);
        continue;
      }
      const right = body.get(x + 1, y), left = body.get(x - 1, y), up = body.get(x, y - 1);
      let out = c;
      if (!right) out = P.cathRim;
      else if (!body.get(x + 2, y) && dither(x, y, 0.5)) out = P.cathLit;
      else if (!up) out = P.cathLit;
      else if (!left) out = P.cathDark;
      layer.set(x, y, out);
    }
  return windows;
}

function paintLand(L: Layout, rand: () => number) {
  const land = new Layer(L.W, L.H);
  // far ridge with a ragged treeline
  for (let x = 0; x < L.W; x++) {
    const ridge = L.horizon - 4 - Math.round(noise1(x / 18, 3) * 9 + noise1(x / 5, 7) * 3);
    for (let y = ridge; y <= L.horizon; y++) land.set(x, y, P.hill);
    if (rand() < 0.3) {
      const th = 2 + Math.floor(rand() * 5);
      for (let i = 0; i < th; i++) land.set(x, ridge - i, P.hill);
    }
  }
  const windows = paintCathedral(land, L, rand);
  // nearer ridge and the dark ground beneath
  for (let x = 0; x < L.W; x++) {
    const near = L.horizon + 1 - Math.round(noise1(x / 26, 11) * 3);
    for (let y = near; y < L.H; y++) {
      const t = (y - near) / Math.max(1, L.H - near);
      land.set(x, y, dither(x, y, 0.35 - t * 0.3 + noise1(x / 7 + y, 5) * 0.2) ? P.groundTex : y < L.ground ? P.hillNear : P.ground);
    }
  }
  const lanterns: { x: number; y: number; p: number }[] = [];
  const n = L.W > 100 ? 7 : 2;
  for (let i = 0; i < n; i++)
    lanterns.push({ x: Math.round(L.cath.x + (rand() - 0.35) * L.W * 0.32), y: L.horizon + 2 + Math.floor(rand() * 4), p: rand() * 6 });
  return { land, windows, lanterns };
}

type Clump = { layer: Layer; x: number; y: number; p: number };

function paintTrees(L: Layout, rand: () => number) {
  const trunks = new Layer(L.W, L.H);
  const clumps: Clump[] = [];
  const clump = (cx: number, cy: number, r: number) => {
    const size = Math.ceil(r * 2 + 3), layer = new Layer(size, size), o = size / 2;
    for (let y = 0; y < size; y++)
      for (let x = 0; x < size; x++) {
        const d = Math.hypot(x - o, (y - o) * 1.15) / r;
        if (d > 1 || (d > 0.72 && rand() < 0.5)) continue;
        const v = (y - o) / r + (rand() - 0.5) * 0.7;
        let c = v < -0.45 ? P.leaf2 : v < 0.2 ? P.leaf1 : P.leaf0;
        if (v < -0.55 && x > o && rand() < 0.35) c = P.leaf3;
        layer.set(x, y, c);
      }
    clumps.push({ layer, x: Math.round(cx - o), y: Math.round(cy - o), p: rand() * Math.PI * 2 });
  };
  const H = L.H, W = L.W;
  if (L.treeL) {
    const bx = Math.round(W * 0.05);
    thickLine(trunks, bx - 2, H + 2, bx + 6, H * 0.62, 11, 8, P.trunk);
    thickLine(trunks, bx + 6, H * 0.62, bx - 1, H * 0.2, 8, 5, P.trunk);
    thickLine(trunks, bx - 1, H * 0.2, bx + 3, -4, 5, 3, P.trunk);
    const branches: [number, number, number, number, number][] = [
      [bx + 5, H * 0.55, W * 0.16, H * 0.32, 3],
      [bx + 2, H * 0.34, W * 0.19, H * 0.15, 2.5],
      [bx + 1, H * 0.22, W * 0.12, H * 0.05, 2],
      [W * 0.1, H * 0.45, W * 0.21, H * 0.43, 1.5],
    ];
    for (const [x0, y0, x1, y1, w] of branches) thickLine(trunks, x0, y0, x1, y1, w, 1, P.trunk);
    // moonlit right edge of the bark
    for (let y = 0; y < H; y++) for (let x = 0; x < W * 0.3; x++) if (trunks.get(x, y) && !trunks.get(x + 1, y) && dither(x, y, 0.6)) trunks.set(x, y, P.trunkLit);
    const spots: [number, number, number][] = [
      [W * 0.16, H * 0.3, 10], [W * 0.19, H * 0.13, 11], [W * 0.11, H * 0.05, 13], [W * 0.03, H * 0.12, 12],
      [W * 0.12, H * 0.22, 9], [W * 0.05, H * 0.3, 8], [W * 0.2, H * 0.42, 6],
    ];
    for (const [x, y, r] of spots) clump(x, y, r * Math.min(1, W / 260));
  }
  if (L.treeR) {
    thickLine(trunks, W + 3, H * 0.34, W * 0.9, H * 0.08, 6, 3, P.trunk);
    thickLine(trunks, W * 0.94, H * 0.2, W * 0.84, H * 0.1, 2, 1, P.trunk);
    const spots: [number, number, number][] = [[W * 0.97, H * 0.05, 13], [W * 0.88, H * 0.03, 11], [W * 0.82, H * 0.08, 8], [W, H * 0.2, 10]];
    for (const [x, y, r] of spots) clump(x, y, r);
  }
  return { trunks, clumps };
}

type Blade = { x: number; y: number; h: number; c: Color; p: number };

function plantGrass(L: Layout, rand: () => number) {
  const blades: Blade[] = [];
  const rows = L.H - L.ground;
  for (let y = L.ground; y < L.H + 2; y++) {
    const depth = (y - L.ground) / Math.max(1, rows);
    const per = Math.round(L.W * (0.1 + depth * 0.22));
    for (let i = 0; i < per; i++) {
      // clumps: blades gather where low-frequency noise is high
      const x = Math.floor(rand() * L.W);
      if (noise1(x / 9 + y * 0.37, 21) < 0.35) continue;
      const h = 1 + Math.round(rand() * (2 + depth * 5));
      const ci = Math.min(4, Math.max(0, Math.floor(depth * 2.2 + rand() * 1.8 + (rand() < 0.06 ? 1.5 : 0))));
      blades.push({ x, y, h, c: P.grass[ci], p: rand() * 6 });
    }
  }
  return blades;
}

// ---------- the knight ----------

/** Back view, horned helm, cape, greatsword held upright on the right; about 22 x 46 at s = 1. */
function drawKnight(f: Layer, ox: number, oy: number, s: number, t: number, glint: number) {
  const px = (x: number, y: number, c: Color) => f.rect(ox + x * s, oy + y * s, s, s, c);
  const row = (x0: number, x1: number, y: number, c: Color) => { for (let x = x0; x <= x1; x++) px(x, y, c); };
  // greatsword (cols 17-18), tip at the top
  for (let y = 0; y < 22; y++) {
    px(17, y, P.steel1);
    if (y > 0) px(18, y, P.steel0);
  }
  if (glint >= 0) {
    const gy = Math.round(21 - glint * 21);
    px(17, gy, P.steel2);
    if (gy + 1 < 22) px(17, gy + 1, P.steel1);
  }
  row(14, 21, 22, P.gold1);
  px(14, 23, P.gold0);
  px(21, 23, P.gold0);
  for (let y = 23; y < 27; y++) { px(17, y, P.leather); px(18, y, P.leather); }
  px(17, 27, P.gold1);
  px(18, 27, P.gold0);
  // horns
  const horn: [number, number][] = [[3, 3], [3, 4], [4, 5], [4, 6], [5, 7], [6, 8]];
  for (const [x, y] of horn) { px(x, y, P.horn); px(15 - x, y, P.horn); }
  px(4, 6, P.hornShade); px(11, 6, P.hornShade); px(5, 7, P.hornShade); px(10, 7, P.hornShade);
  // helm
  row(6, 9, 7, P.outline);
  row(5, 10, 8, P.armor1); row(5, 10, 9, P.armor1); row(5, 10, 10, P.armor0); row(6, 9, 11, P.armor0);
  px(9, 8, P.armor3); px(9, 9, P.armor2); px(10, 9, P.armor2); px(6, 8, P.armor2);
  // pauldrons and shoulders
  row(2, 13, 12, P.armor1); row(1, 14, 13, P.armor1); row(1, 14, 14, P.armor0);
  row(2, 5, 12, P.armor2); row(10, 13, 12, P.armor2); px(12, 12, P.armor3); px(13, 13, P.armor3); px(3, 12, P.armor3);
  // right arm reaching for the grip
  for (let y = 15; y < 24; y++) { px(14, y, P.armor1); px(15, y, y > 18 ? P.armor1 : P.armor0); }
  px(16, 23, P.armor2); px(16, 24, P.armor1); px(15, 24, P.armor1); px(16, 25, P.armor0);
  // cape: widens to the hem, folds every few columns, the hem flutters
  const wave = Math.sin(t * 2.6);
  for (let y = 15; y < 41; y++) {
    const k = (y - 15) / 26;
    const x0 = Math.round(2 - k * 2.5 + (y > 34 ? wave * 0.6 * (y - 34) / 6 : 0));
    const x1 = Math.round(13 + k * 1.5 + (y > 30 ? wave * (y - 30) / 10 : 0));
    for (let x = x0; x <= x1; x++) {
      let c = P.cape1;
      if ((x - x0) % 4 === 0) c = P.cape0;
      else if (x === x0 || (x === x0 + 1 && y < 30)) c = P.cape2;
      else if (x === x1) c = P.cape0;
      px(x, y, c);
    }
  }
  // ragged hem, two frames
  const frame = Math.floor(t * 3) % 2;
  for (let x = -1; x <= 15; x++) if ((x + frame) % 3 === 0) px(x, 41, P.cape1);
  for (let x = 0; x <= 14; x++) if ((x + frame) % 5 === 1) px(x, 42, P.cape0);
  // boots under the cape
  row(4, 6, 43, P.armor0); row(9, 11, 43, P.armor0); row(4, 6, 44, P.outline); row(9, 11, 44, P.outline);
}

// ---------- the scene ----------

export type PixelScene = { render(t: number, dt: number): void; W: number; H: number };

export function createScene(ctx: CanvasRenderingContext2D, variant: SceneVariant, aspect: number): PixelScene {
  const L = layoutFor(variant, aspect);
  const rand = rng(variant === "card" ? 7 : 42);
  ctx.canvas.width = L.W;
  ctx.canvas.height = L.H;
  const image = ctx.createImageData(L.W, L.H);
  const frame = new Layer(L.W, L.H);
  const out = new Uint32Array(image.data.buffer);

  const { sky, stars } = paintSky(L, rand);
  const moon = paintMoon(L);
  const { land, windows, lanterns } = paintLand(L, rand);
  const { trunks, clumps } = paintTrees(L, rand);
  const blades = plantGrass(L, rand);
  const clouds = Array.from({ length: L.clouds }, (_, i) => {
    const w = Math.round((variant === "card" ? 22 : 34) + rand() * (variant === "card" ? 14 : 46));
    const h = Math.round(w * (0.18 + rand() * 0.1));
    const y = Math.round(L.moon.y - L.moon.r * 0.4 + (rand() - 0.25) * L.horizon * 0.55 + (i % 2) * 6);
    return { layer: paintCloud(w, h, rand), x: rand() * (L.W + w) - w, y: Math.max(2, y), v: 1.2 + rand() * 2.4 };
  });
  const leafSpawn = () => {
    const c = clumps.length ? clumps[Math.floor(rand() * clumps.length)] : null;
    return {
      x: c ? c.x + c.layer.w / 2 + (rand() - 0.5) * c.layer.w : rand() * L.W,
      y: c ? c.y + c.layer.h * 0.6 : -2,
      v: 5 + rand() * 7,
      p: rand() * 6,
      c: rand() < 0.5 ? P.leaf2 : P.leaf3,
    };
  };
  const leaves = Array.from({ length: L.leaves }, () => {
    const l = leafSpawn();
    l.y += rand() * L.H;
    return l;
  });
  const flies = Array.from({ length: L.flies }, () => ({
    x: rand() * L.W,
    y: L.horizon - 6 + rand() * (L.H - L.horizon),
    p: rand() * 6,
    v: 0.5 + rand(),
  }));
  let glintAt = 1.5;

  function render(t: number, dt: number) {
    const f = frame;
    f.data.set(sky.data);
    // stars twinkle
    for (const s of stars) {
      const b = Math.sin(t * s.s + s.p);
      if (b > 0.85) f.set(s.x, s.y, P.starHot);
      else if (b > -0.2) f.set(s.x, s.y, P.star);
      else if (b > -0.7) f.set(s.x, s.y, P.starDim);
    }
    // halo breathes around the moon
    const { x: mx, y: my, r } = L.moon, breathe = 0.85 + 0.15 * Math.sin(t * 0.7);
    for (let y = Math.floor(my - r * 2); y <= my + r * 2; y++)
      for (let x = Math.floor(mx - r * 2); x <= mx + r * 2; x++) {
        const d = Math.hypot(x - mx, y - my);
        if (d <= r || d > r * 2) continue;
        const k = (1 - (d - r) / r) * breathe;
        if (dither(x, y, k * k * 0.5)) f.set(x, y, k > 0.7 ? P.halo1 : P.halo0);
      }
    f.blit(moon);
    // clouds drift right, parallax by height
    for (const c of clouds) {
      c.x += c.v * dt * (variant === "card" ? 0.5 : 1);
      if (c.x > L.W + 2) c.x = -c.layer.w - 2;
      f.blit(c.layer, Math.round(c.x), c.y);
    }
    f.blit(land);
    // windows and lanterns flicker
    for (const w of windows) {
      const k = 0.55 + 0.45 * Math.sin(t * 3.1 + w.p * 9) * Math.sin(t * 1.3 + w.p * 4);
      if (k > 0.35) f.set(w.x, w.y, k > 0.8 ? P.glow2 : P.glow1);
      if (k > 0.55) f.set(w.x + 1, w.y + 1, P.glow0);
    }
    for (const l of lanterns) {
      const k = 0.6 + 0.4 * Math.sin(t * 5 + l.p) * Math.sin(t * 2.3 + l.p * 2);
      f.set(l.x, l.y, k > 0.5 ? P.glow2 : P.glow1);
      if (k > 0.75) { f.set(l.x - 1, l.y, P.glow0); f.set(l.x + 1, l.y, P.glow0); f.set(l.x, l.y - 1, P.glow0); }
    }
    // low fog drifting along the horizon
    for (let y = L.horizon - 7; y < L.horizon + 4; y++) {
      const band = 1 - Math.abs(y - (L.horizon - 2)) / 6;
      for (let x = 0; x < L.W; x++) {
        const n = noise1(x / 22 + t * 0.12 + y * 0.31, 9) * band;
        if (dither(x, y, n * 0.55)) f.set(x, y, P.fog);
      }
    }
    f.blit(trunks);
    for (const c of clumps) f.blit(c.layer, c.x + Math.round(Math.sin(t * 0.9 + c.p) * 0.7), c.y + (Math.sin(t * 0.7 + c.p) > 0.6 ? 1 : 0));
    // the knight, with an occasional glint up the blade
    glintAt -= dt;
    let glint = -1;
    if (glintAt < 0) {
      glint = -glintAt / 0.7;
      if (glint > 1) glintAt = 4 + Math.random() * 4;
    }
    // red grass in the wind: rows behind the knight's feet first, the rest over his boots
    const gust = 0.6 + 0.4 * Math.sin(t * 0.45);
    const feet = L.knight.y;
    const grass = (front: boolean) => {
      for (const b of blades) {
        if (b.y > feet !== front) continue;
        const sway = Math.round(Math.sin(t * 1.7 + b.x * 0.09 + b.y * 0.05 + b.p * 0.2) * gust * Math.min(2, b.h / 3));
        for (let i = 0; i < b.h; i++) f.set(b.x + (i >= b.h / 2 ? sway : 0), b.y - i, b.c);
      }
    };
    grass(false);
    drawKnight(f, L.knight.x - 8 * L.knight.s, L.knight.y - 45 * L.knight.s, L.knight.s, t, glint > 1 ? -1 : glint);
    grass(true);
    // falling leaves
    for (const l of leaves) {
      l.y += l.v * dt;
      l.x += (Math.sin(t * 1.6 + l.p) * 7 + 3) * dt;
      if (l.y > L.H + 2 || l.x > L.W + 2) Object.assign(l, leafSpawn());
      f.set(l.x, l.y, l.c);
      if (Math.sin(t * 4 + l.p) > 0) f.set(l.x + 1, l.y, l.c);
    }
    // fireflies
    for (const fl of flies) {
      const x = fl.x + Math.sin(t * 0.4 * fl.v + fl.p) * 9, y = fl.y + Math.sin(t * 0.7 * fl.v + fl.p * 2) * 4;
      const k = Math.sin(t * 1.8 * fl.v + fl.p);
      if (k > 0.2) {
        f.set(x, y, P.fly1);
        if (k > 0.7) { f.set(x - 1, y, P.fly0); f.set(x + 1, y, P.fly0); f.set(x, y - 1, P.fly0); f.set(x, y + 1, P.fly0); }
      }
    }
    out.set(f.data);
    ctx.putImageData(image, 0, 0);
  }

  return { render, W: L.W, H: L.H };
}

