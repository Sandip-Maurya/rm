// Deterministic 2D Simplex Noise implementation (no external RNG state)
const F2 = 0.5 * (Math.sqrt(3) - 1);
const G2 = (3 - Math.sqrt(3)) / 6;

const GRAD3: ReadonlyArray<readonly [number, number]> = [
  [1, 1],
  [-1, 1],
  [1, -1],
  [-1, -1],
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

const PERM = (() => {
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) {
    p[i] = i;
  }
  let seed = 133742;
  for (let i = 255; i > 0; i--) {
    seed = (seed * 16807) % 2147483647;
    const j = seed % (i + 1);
    const tmp = p[i] ?? 0;
    p[i] = p[j] ?? 0;
    p[j] = tmp;
  }
  const perm = new Uint8Array(512);
  for (let i = 0; i < 512; i++) {
    perm[i] = p[i & 255] ?? 0;
  }
  return perm;
})();

function dot2(g: readonly [number, number], x: number, y: number): number {
  return g[0] * x + g[1] * y;
}

/** Deterministic 2D Simplex Noise returning values roughly in [-1, 1] */
export function simplex2D(xin: number, yin: number): number {
  const s = (xin + yin) * F2;
  const i = Math.floor(xin + s);
  const j = Math.floor(yin + s);
  const t = (i + j) * G2;
  const x0 = xin - (i - t);
  const y0 = yin - (j - t);

  const i1 = x0 > y0 ? 1 : 0;
  const j1 = x0 > y0 ? 0 : 1;

  const x1 = x0 - i1 + G2;
  const y1 = y0 - j1 + G2;
  const x2 = x0 - 1 + 2 * G2;
  const y2 = y0 - 1 + 2 * G2;

  const ii = i & 255;
  const jj = j & 255;

  const gi0 = (PERM[ii + (PERM[jj] ?? 0)] ?? 0) % 8;
  const gi1 = (PERM[ii + i1 + (PERM[jj + j1] ?? 0)] ?? 0) % 8;
  const gi2 = (PERM[ii + 1 + (PERM[jj + 1] ?? 0)] ?? 0) % 8;

  let n0 = 0;
  let t0 = 0.5 - x0 * x0 - y0 * y0;
  if (t0 >= 0) {
    t0 *= t0;
    n0 = t0 * t0 * dot2(GRAD3[gi0] ?? [1, 1], x0, y0);
  }

  let n1 = 0;
  let t1 = 0.5 - x1 * x1 - y1 * y1;
  if (t1 >= 0) {
    t1 *= t1;
    n1 = t1 * t1 * dot2(GRAD3[gi1] ?? [1, 1], x1, y1);
  }

  let n2 = 0;
  let t2 = 0.5 - x2 * x2 - y2 * y2;
  if (t2 >= 0) {
    t2 *= t2;
    n2 = t2 * t2 * dot2(GRAD3[gi2] ?? [1, 1], x2, y2);
  }

  return 70 * (n0 + n1 + n2);
}
