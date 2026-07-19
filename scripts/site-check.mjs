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
for (const group of en.relationships.dimensions) copy.push(group.desc);
copy.push(en.opusPurum.subtitle, en.luxAperta.subtitle, en.luxAperta.lead, ...en.luxAperta.paragraphs);
for (const format of en.luxAperta.formats) {
  copy.push(format.tagline, ...format.paragraphs);
  for (const fact of format.facts ?? []) copy.push(fact.label, fact.value);
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
// 2. Anchors: every named heading is deep-linkable
// ---------------------------------------------------------------------------

// Mirror of slugify in src/anchors.ts.
const slugify = (text) =>
  String(text)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const expectedAnchors = [
  ...Object.values(en.principles.modules).map((mod) => slugify(mod.title)),
  ...Object.values(en.principles.modules).flatMap((mod) => mod.list.map((i) => slugify(i.title))),
  ...en.opusPurum.chapters.map((c) => `opus-purum-${slugify(c.title)}`),
  ...Object.values(en.exocortex.stack).map((i) => slugify(i.title)),
  slugify(en.relationships.dimensionsTitle),
  ...en.relationships.principles.map((i) => slugify(i.title)),
  ...en.luxAperta.formats.map((f) => slugify(f.title)),
];
check(
  new Set(expectedAnchors).size === expectedAnchors.length,
  'anchors: slug collision between two English titles'
);

const anchorContext = await browser.newContext({ locale: 'en-US' });
const anchorPage = await anchorContext.newPage();
await anchorPage.goto(url);
await anchorPage.waitForTimeout(800);

const anchorState = await anchorPage.evaluate((anchors) => {
  const allIds = Array.from(document.querySelectorAll('[id]')).map((el) => el.id);
  const duplicates = allIds.filter((id, i) => allIds.indexOf(id) !== i);
  const results = {};
  for (const anchor of anchors) {
    const el = document.getElementById(anchor);
    results[anchor] = {
      exists: el !== null,
      isHeading: el !== null && /^H[1-6]$/.test(el.tagName),
      hasSelfLink: el !== null && el.querySelector(`a[href="#${anchor}"]`) !== null,
    };
  }
  return { duplicates, results };
}, expectedAnchors);

check(anchorState.duplicates.length === 0, `anchors: duplicate DOM ids: ${anchorState.duplicates}`);
for (const [anchor, state] of Object.entries(anchorState.results)) {
  check(state.exists, `anchors: #${anchor} missing from DOM`);
  check(!state.exists || state.isHeading, `anchors: #${anchor} is not on a heading`);
  check(!state.exists || state.hasSelfLink, `anchors: #${anchor} has no self-link`);
}
await anchorContext.close();

// Deep links must open collapsed targets: an accordion chapter and a card.
const deepLinks = [
  `opus-purum-${slugify(en.opusPurum.chapters[1].title)}`,
  slugify(en.principles.modules.moduleBeing.list[0].title),
  slugify(en.luxAperta.formats[0].title),
];
for (const anchor of deepLinks) {
  const context = await browser.newContext({ locale: 'en-US' });
  const page = await context.newPage();
  await page.goto(`${url}#${anchor}`);
  await page.waitForTimeout(1200);
  const state = await page.evaluate((id) => {
    const el = document.getElementById(id);
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    const link = el.querySelector('a[aria-expanded]');
    return {
      inViewport: rect.top >= -rect.height && rect.top < window.innerHeight,
      expanded: link ? link.getAttribute('aria-expanded') : 'not-a-disclosure',
    };
  }, anchor);
  check(state !== null, `deep link: #${anchor} target missing`);
  check(state?.inViewport === true, `deep link: #${anchor} not scrolled into view`);
  check(
    state?.expanded === 'true' || state?.expanded === 'not-a-disclosure',
    `deep link: #${anchor} did not open its disclosure (aria-expanded=${state?.expanded})`
  );
  await context.close();
}

// ---------------------------------------------------------------------------
// 3. Accessibility (axe-core), light and dark, mobile and desktop
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
