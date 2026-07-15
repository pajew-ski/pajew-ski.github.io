// One-off asset generator for the social preview image (public/og-image.png,
// 1200x630, rendered at 2x). NOT part of `npm run build`: the flower is
// deterministic, so the PNG is generated once and committed as a static asset.
// Re-run manually only when the card design, name, or tagline changes:
//   node scripts/generate-og-image.mjs
//
// The 24 logarithmic spirals are reproduced with the exact math from
// src/components/KrystalFlower.tsx so the card stays 1:1 with the live logo.

import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// --- Krystal Flower geometry (mirrors KrystalFlower.tsx exactly) ---
const CX = 250;
const CY = 250;
const R = 200;
const r0 = R / 64;

function generateSpiralPath(baseAngle, dir) {
  const TURNS = 1.5;
  const INNER_TURNS = 0.5;
  const STEPS = 480;
  const parts = [];
  for (let i = 0; i <= STEPS; i++) {
    const theta = (-INNER_TURNS + (i / STEPS) * (TURNS + INNER_TURNS)) * 2 * Math.PI;
    const r = r0 * Math.pow(2, (2 * theta) / Math.PI);
    const angle = baseAngle + dir * theta;
    const x = CX + r * Math.cos(angle);
    const y = CY + r * Math.sin(angle);
    parts.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return parts.join(' ');
}

const SPIRALS = Array.from({ length: 12 }, (_, k) => {
  const base = -Math.PI / 2 + k * (Math.PI / 6);
  return [
    { path: generateSpiralPath(base, +1), dir: 1 },
    { path: generateSpiralPath(base, -1), dir: -1 },
  ];
}).flat();

const flowerPaths = SPIRALS.map(
  (s) =>
    `<path d="${s.path}" fill="none" stroke="hsl(0 0% 98%)" stroke-width="2" opacity="${
      s.dir === 1 ? 0.52 : 0.34
    }"/>`
).join('');

// --- Card layout (1200x630, dark theme of the site: bg 0 0% 0%) ---
// Golden split: text column on the left, flower on the right.
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 1200px; height: 630px; }
  body {
    background: hsl(0 0% 0%);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: hsl(0 0% 98%);
    display: flex; align-items: center; overflow: hidden;
  }
  .text { padding-left: 96px; width: 742px; }
  .label {
    font-size: 20px; letter-spacing: 0.3em; text-transform: uppercase;
    color: hsl(0 0% 63.9%); font-weight: 300; margin-bottom: 28px;
  }
  .name { font-size: 76px; font-weight: 700; letter-spacing: -0.03em; line-height: 1; }
  .tagline {
    font-size: 30px; font-weight: 300; color: hsl(0 0% 63.9%);
    margin-top: 28px; letter-spacing: -0.01em;
  }
  .flower { width: 458px; height: 630px; display: flex; align-items: center; justify-content: center; }
  .flower svg { width: 400px; height: 400px; }
</style></head><body>
  <div class="text">
    <div class="label">Regensburg</div>
    <div class="name">Michael Pajewski</div>
    <div class="tagline">Data Scientist, Tänzer, Kreativer</div>
  </div>
  <div class="flower">
    <svg viewBox="0 0 500 500"><g>${flowerPaths}</g></svg>
  </div>
</body></html>`;

const work = mkdtempSync(join(tmpdir(), 'og-'));
const htmlPath = join(work, 'card.html');
writeFileSync(htmlPath, html);

const outPath = resolve(root, 'public', 'og-image.png');

const chromium =
  '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
if (!existsSync(chromium)) {
  throw new Error(`chromium not found at ${chromium}; adjust the path for this environment`);
}

execFileSync(
  chromium,
  [
    '--headless',
    '--no-sandbox',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-device-scale-factor=2',
    '--window-size=1200,630',
    `--screenshot=${outPath}`,
    `file://${htmlPath}`,
  ],
  { stdio: 'inherit' }
);

rmSync(work, { recursive: true, force: true });
console.log(`og-image: written to ${outPath} (2400x1260)`);
