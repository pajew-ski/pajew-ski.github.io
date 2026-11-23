// Checks for site/, run via `npm run check:site` (CI runs it on every push,
// see .github/workflows/checks.yml). Nothing here builds the site; when a
// check breaks, the site still deploys as it stands in the repo.
//
// 1. Own origin only: no shipped file pulls code or style from an absolute
//    http(s) address (script src, stylesheet link, import, @import). Links a
//    reader follows are allowed.
// 2. Albedo: the token block in index.html is the one of the family, and no
//    color outside it carries chroma.
// 3. Anchors: ids are unique, every h2 and every card h3 links to its own
//    id, and a deep link into a closed chapter opens it (a summary may not
//    hold a link, so chapters are reached by id alone).
// 4. Language: German and English each show one heading per section and
//    hide the other language; ?lang overrides the browser.
// 5. Reader mode: Readability (the engine behind Firefox Reader View)
//    extracts every heading of the page.
// 6. Layout and accessibility: at 360, 390 and 1440 px, light and dark, no
//    horizontal scroll, no console error, no axe violation.

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
import { AxeBuilder } from '@axe-core/playwright';
import { chromium } from 'playwright-core';
import { serve, siteRoot } from './serve.mjs';

const failures = [];
const check = (ok, message) => {
  if (!ok) failures.push(message);
  return ok;
};

// 1. Own origin only ---------------------------------------------------------
const foreign = [
  /<script[^>]+src=["']https?:/i,
  /<link[^>]+rel=["']stylesheet["'][^>]+href=["']https?:/i,
  /<link[^>]+href=["']https?:[^>]+rel=["']stylesheet["']/i,
  /\bimport\s*\(?\s*["']https?:/i,
  /@import\s+(url\()?["']?https?:/i,
];
for (const name of readdirSync(siteRoot)) {
  if (!/\.(html|css|js|svg)$/.test(name)) continue;
  const text = readFileSync(join(siteRoot, name), 'utf8');
  for (const pattern of foreign) check(!pattern.test(text), `${name}: loads from a foreign address (${pattern})`);
}

// 2. Albedo -------------------------------------------------------------------
const html = readFileSync(join(siteRoot, 'index.html'), 'utf8');
const block = html.match(/\/\* albedo: Anfang \*\/[\s\S]*?\/\* albedo: Ende \*\//);
if (check(block, 'index.html: albedo token block missing')) {
  for (const token of ['--bg: oklch(98% 0 0)', '--surface: oklch(94% 0 0)', '--border: oklch(85% 0 0)',
    '--text: oklch(15% 0 0)', '--text-muted: oklch(40% 0 0)', '--step-7: 128px', '--type-4: 4rem', '--leading: 1.414']) {
    check(block[0].includes(token), `albedo block: ${token} missing`);
  }
  // Every style outside the block: the rest of <style> and inline styles.
  const styles = (html.match(/<style>([\s\S]*?)<\/style>/)?.[1] ?? '').replace(block[0], '');
  const chromatic = styles.match(/oklch\(\s*[\d.]+%?\s+(?!0[\s)])[\d.]+[^)]*\)/g) ?? [];
  check(chromatic.length === 0, `colour with chroma outside the albedo block: ${chromatic.join(', ')}`);
  check(!/#[0-9a-f]{3,8}\b|rgb\(|hsl\(/i.test(styles), 'hex, rgb or hsl colour outside the albedo block');
  check(!/\sstyle=/.test(html), 'inline style attribute in index.html');
}

// Browser ---------------------------------------------------------------------
async function launchBrowser() {
  const attempts = [
    process.env.CHROME_PATH && { executablePath: process.env.CHROME_PATH },
    { channel: 'chrome' },
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

const server = await serve(0);
const url = `http://127.0.0.1:${server.address().port}/`;
const browser = await launchBrowser();

// 3. Anchors ------------------------------------------------------------------
{
  const page = await (await browser.newContext({ locale: 'de-DE' })).newPage();
  await page.goto(url);
  const state = await page.evaluate(() => {
    const ids = Array.from(document.querySelectorAll('[id]'), (el) => el.id);
    const selfLinks = Array.from(document.querySelectorAll('section h2, .card h3')).map((h) => ({
      text: h.textContent.trim(),
      ok: h.querySelector('a.self')?.getAttribute('href') === `#${(h.closest('.card') ?? h.closest('section')).id}`,
    }));
    return { ids, selfLinks };
  });
  const seen = new Set();
  for (const id of state.ids) {
    check(!seen.has(id), `duplicate id #${id}`);
    seen.add(id);
  }
  for (const link of state.selfLinks) check(link.ok, `heading "${link.text}" does not link to its own id`);
  for (const id of ['intro', 'opus-purum', 'open-formats', 'projects', 'opus-purum-axioms', 'iter-apertum', 'temet-nosce']) {
    check(seen.has(id), `anchor #${id} missing`);
  }

  // A deep link opens its chapter and closes the first one.
  await page.goto(`${url}#opus-purum-the-self`);
  const opened = await page.evaluate(() => ({
    target: document.getElementById('opus-purum-the-self').open,
    first: document.getElementById('opus-purum-the-one').open,
  }));
  check(opened.target && !opened.first, 'deep link #opus-purum-the-self does not open its chapter alone');
  await page.context().close();
}

// 4. Language -----------------------------------------------------------------
for (const [locale, query, lang] of [['de-DE', '', 'de'], ['en-US', '', 'en'], ['en-US', '?lang=de', 'de'], ['de-DE', '?lang=en', 'en']]) {
  const page = await (await browser.newContext({ locale })).newPage();
  await page.goto(url + query);
  const seen = await page.evaluate(() => ({
    lang: document.documentElement.lang,
    other: Array.from(document.querySelectorAll('[lang]:not(html)')).filter(
      (el) => el.lang !== document.documentElement.lang && el.checkVisibility()
    ).length,
    h2: Array.from(document.querySelectorAll('h2')).map((h) => h.innerText.trim()),
  }));
  check(seen.lang === lang, `${locale}${query}: lang is ${seen.lang}, expected ${lang}`);
  check(seen.other === 0, `${locale}${query}: ${seen.other} elements of the other language visible`);
  check(seen.h2.every((t) => t && !t.includes('\n')), `${locale}${query}: a section heading shows both languages`);
  await page.context().close();
}

// 5. Reader mode --------------------------------------------------------------
{
  const page = await (await browser.newContext({ locale: 'de-DE' })).newPage();
  await page.goto(url);
  const headings = await page.evaluate(() =>
    Array.from(document.querySelectorAll('h2, h3, h4'), (h) => h.textContent.replace(/\s+/g, ' ').trim())
  );
  const doc = new JSDOM(await page.content(), { url }).window.document;
  const article = new Readability(doc).parse();
  const text = (article?.textContent ?? '').replace(/\s+/g, ' ');
  for (const heading of headings) {
    // A heading with both languages extracts as both spans run together.
    check(text.includes(heading), `reader mode drops heading "${heading}"`);
  }
  await page.context().close();
}

// 6. Layout and accessibility ---------------------------------------------------
for (const [width, height] of [[360, 780], [390, 844], [1440, 900]]) {
  for (const colorScheme of ['light', 'dark']) {
    for (const locale of ['de-DE', 'en-US']) {
      const context = await browser.newContext({ viewport: { width, height }, colorScheme, locale });
      const page = await context.newPage();
      const errors = [];
      page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
      page.on('pageerror', (e) => errors.push(e.message));
      await page.goto(url);
      await page.waitForTimeout(200);
      const label = `${width}px ${colorScheme} ${locale}`;
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      check(overflow <= 0, `${label}: horizontal scroll of ${overflow}px`);
      check(errors.length === 0, `${label}: console errors: ${errors.join(' | ')}`);
      // The flower reveal is decoration; axe measures the settled page.
      await page.addStyleTag({ content: '*{animation:none!important;transition:none!important}' });
      const { violations } = await new AxeBuilder({ page }).analyze();
      for (const v of violations) {
        check(false, `${label}: axe ${v.id}: ${v.help} (${v.nodes.length})`);
      }
      await context.close();
    }
  }
}

await browser.close();
server.close();

if (failures.length) {
  console.error(`site-check: ${failures.length} failure(s)`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log('site-check: all checks passed');
