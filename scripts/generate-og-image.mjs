// One-off asset generator for the social preview image (site/og-image.png,
// 1200x630, rendered at 2x). NOT part of `npm run build`: the flower is
// deterministic, so the PNG is generated once and committed as a static asset.
// Re-run manually only when the card design or title changes:
//   node scripts/generate-og-image.mjs
//
// The 24 logarithmic spirals are reproduced with the exact math of the
// flower script at the end of site/index.html, so the card stays 1:1 with
// the live logo. Set CHROME_PATH if Chrome is not at the default path.

import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// --- Krystal Flower geometry (mirrors site/index.html exactly) ---
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
    `<path d="${s.path}" fill="none" stroke="oklch(95% 0 0)" stroke-width="2" opacity="${
      s.dir === 1 ? 0.52 : 0.34
    }"/>`
).join('');

// --- Card layout (1200x630, Albedo dark: bg 15, text-muted 70, text 95) ---
// Text column on the left, flower on the right.
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 1200px; height: 630px; }
  body {
    background: oklch(15% 0 0);
    font-family: system-ui, sans-serif;
    color: oklch(95% 0 0);
    display: flex; align-items: center; overflow: hidden;
  }
  .text { padding-left: 128px; width: 742px; }
  .label {
    font-size: 20px; letter-spacing: 0.3em; text-transform: uppercase;
    color: oklch(70% 0 0); font-weight: 300; margin-bottom: 32px;
  }
  .name { font-size: 64px; font-weight: 700; letter-spacing: -0.05em; line-height: 1; }
  .tagline {
    font-size: 32px; font-weight: 300; color: oklch(70% 0 0);
    margin-top: 32px; letter-spacing: -0.01em; line-height: 1.414;
  }
  .flower { width: 458px; height: 630px; display: flex; align-items: center; justify-content: center; }
  .flower svg { width: 400px; height: 400px; }
</style></head><body>
  <div class="text">
    <div class="label">pajew.ski</div>
    <div class="name">Frei zum Mitnehmen</div>
    <div class="tagline">Opus Purum, offene Formate und quelloffene Werkzeuge.</div>
  </div>
  <div class="flower">
    <svg viewBox="0 0 500 500"><g>${flowerPaths}</g></svg>
  </div>
</body></html>`;

const work = mkdtempSync(join(tmpdir(), 'og-'));
const htmlPath = join(work, 'card.html');
writeFileSync(htmlPath, html);

const outPath = resolve(root, 'site', 'og-image.png');

const chromium = process.env.CHROME_PATH || '/usr/bin/google-chrome';
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
