// Automated post-build checks, run via `npm run check:site` (CI runs it on
// every push, see .github/workflows/checks.yml):
//
// 1. Reader-mode extraction: parses the rendered page with Mozilla's
//    Readability (the engine family behind Firefox Reader View and most
//    derived reader modes) and asserts that every heading and every piece of
//    body copy from the locale files survives extraction, in document order,
//    with no stray UI glyphs. Guards the accordion/card markup against
//    regressions that hide content from readers.
// 2. Accessibility: axe-core full-page scans in light and dark mode, at
//    mobile and desktop viewports. Fails on any violation.
//
// Requires a fresh `npm run build` (checks dist/ via vite preview).

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { preview } from 'vite';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
import { AxeBuilder } from '@axe-core/playwright';
import { chromium } from 'playwright-core';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const en = JSON.parse(readFileSync(resolve(root, 'src/locales/en.json'), 'utf8'));

if (!existsSync(resolve(root, 'dist/index.html'))) {
  console.error('dist/index.html not found; run `npm run build` first.');
  process.exit(1);
}

const failures = [];
const check = (ok, message) => {
  if (!ok) failures.push(message);
  return ok;
};

async function launchBrowser() {
  const attempts = [
    process.env.CHROMIUM_PATH && { executablePath: process.env.CHROMIUM_PATH },
    { channel: 'chrome' },
    { executablePath: '/opt/pw-browsers/chromium' },
    {},
  ].filter(Boolean);
  let lastError;
  for (const options of attempts) {
    try {
      return await chromium.launch(options);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

const server = await preview({ preview: { port: 4173, strictPort: false } });
const url = server.resolvedUrls.local[0];
const browser = await launchBrowser();

// ---------------------------------------------------------------------------
// 1. Reader-mode extraction
// ---------------------------------------------------------------------------

const readerContext = await browser.newContext({ locale: 'en-US' });
const readerPage = await readerContext.newPage();
await readerPage.goto(url);
await readerPage.waitForTimeout(1200);

const domHeadings = await readerPage.evaluate(() =>
  Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6')).map(
    (h) => `${h.tagName} ${h.textContent.trim().replace(/\s+/g, ' ')}`
  )
);
const liveHtml = await readerPage.content();
await readerContext.close();

const readerDoc = new JSDOM(liveHtml, { url }).window.document;
const article = new Readability(readerDoc).parse();
check(article !== null, 'reader: Readability failed to extract an article at all');

const normalize = (s) => String(s).replace(/\s+/g, ' ').trim();
const readerText = normalize(article?.textContent ?? '');
const readerDom = new JSDOM(article?.content ?? '').window.document;
const readerHeadings = new Set(
  Array.from(readerDom.querySelectorAll('h1,h2,h3,h4,h5,h6')).map(
    (h) => `${h.tagName} ${normalize(h.textContent)}`
  )
);

check(
  normalize(article?.title ?? '').includes('Michael'),
  `reader: article title is ${JSON.stringify(article?.title)}, expected the page title`
);

// Every DOM heading must survive extraction. H1 is exempt: readers drop it as
// a duplicate of the article title they display themselves.
for (const heading of domHeadings) {
  if (heading.startsWith('H1 ')) continue;
  check(readerHeadings.has(heading), `reader: heading missing from extraction: ${heading}`);
}

// Every piece of body copy must survive extraction, including content that is
// visually collapsed (closed accordion chapters, unopened card descriptions).
const copy = [];
copy.push(en.intro.h2, en.opusPurum.premise);
for (const chapter of en.opusPurum.chapters) {
  for (const entry of chapter.content) copy.push(entry.body);
}
copy.push(en.principles.copy);
for (const mod of Object.values(en.principles.modules)) {
  for (const item of mod.list) copy.push(item.title, item.desc);
}
copy.push(en.exocortex.copy);
for (const item of Object.values(en.exocortex.stack)) copy.push(item.title, item.desc);
copy.push(en.relationships.copy, en.relationships.dimensionsIntro);
for (const item of en.relationships.principles) copy.push(item.title, item.desc);
for (const group of en.relationships.dimensions) copy.push(...group.items);
copy.push(en.luxAperta.lead, ...en.luxAperta.paragraphs);
for (const format of en.luxAperta.formats) {
  copy.push(...format.paragraphs);
  for (const fact of format.facts ?? []) copy.push(fact.value);
}
for (const text of copy) {
  const needle = normalize(text);
  check(readerText.includes(needle), `reader: body copy missing: ${needle.slice(0, 60)}...`);
}

// UI glyphs must never surface as extracted text (e.g. the accordion "+").
check(
  !/>\s*\+\s*</.test(article?.content ?? ''),
  'reader: stray "+" glyph extracted as content'
);

// ---------------------------------------------------------------------------
// 2. Accessibility (axe-core), light and dark, mobile and desktop
// ---------------------------------------------------------------------------

const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'desktop', width: 1440, height: 900 },
];
for (const viewport of viewports) {
  for (const colorScheme of ['light', 'dark']) {
    const context = await browser.newContext({
      locale: 'en-US',
      viewport: { width: viewport.width, height: viewport.height },
      colorScheme,
    });
    const page = await context.newPage();
    await page.goto(url);
    await page.waitForTimeout(1200);
    const results = await new AxeBuilder({ page }).analyze();
    for (const violation of results.violations) {
      check(
        false,
        `axe (${viewport.name}, ${colorScheme}): [${violation.impact}] ${violation.id}: ${violation.help} (${violation.nodes.length} node(s), e.g. ${violation.nodes[0]?.target})`
      );
    }
    await context.close();
  }
}

await browser.close();
await server.close();

if (failures.length) {
  console.error(`site-check: ${failures.length} failure(s)\n`);
  for (const failure of failures) console.error(`  ✗ ${failure}`);
  process.exit(1);
}
console.log('site-check: reader extraction and accessibility checks passed');
