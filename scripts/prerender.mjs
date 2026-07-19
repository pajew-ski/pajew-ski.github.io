// Post-build step: injects a static HTML snapshot of the site content into
// dist/index.html so crawlers and AI agents that do not execute JavaScript
// still receive the full page text. Content is generated from the primary
// locale (de.json), the same source of truth the React app renders from.
// React replaces the snapshot on mount, so the interactive app is unchanged.
//
// Also stamps dist/llms.txt and dist/llms-full.txt with the build date so
// stale CDN caches are recognizable.

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const t = JSON.parse(readFileSync(resolve(root, 'src/locales/de.json'), 'utf8'));
const en = JSON.parse(readFileSync(resolve(root, 'src/locales/en.json'), 'utf8'));

// Same slug derivation as src/anchors.ts: anchors come from English titles so
// they are language-independent.
const slugify = (text) =>
  String(text)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const esc = (s) =>
  String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

const p = (text) => `<p>${esc(text)}</p>`;

function moduleHtml(mod, enMod) {
  const items = mod.list
    .map(
      (item, i) =>
        `<li id="${slugify(enMod.list[i].title)}"><strong>${esc(item.title)}</strong>: ${esc(item.desc)}</li>`
    )
    .join('');
  return `<h3 id="${slugify(enMod.title)}">${esc(mod.title)}</h3><ul>${items}</ul>`;
}

const opusChapters = t.opusPurum.chapters
  .map((chapter, i) => {
    const entries = chapter.content
      .map((entry) =>
        entry.heading ? `<h4>${esc(entry.heading)}</h4>${p(entry.body)}` : p(entry.body)
      )
      .join('');
    const anchor = `opus-purum-${slugify(en.opusPurum.chapters[i].title)}`;
    return `<h3 id="${anchor}">${esc(chapter.label)} · ${esc(chapter.title)}</h3>${entries}`;
  })
  .join('');

const relationshipPrinciples = t.relationships.principles
  .map(
    (item, i) =>
      `<li id="${slugify(en.relationships.principles[i].title)}"><strong>${esc(item.title)}</strong>: ${esc(item.desc)}</li>`
  )
  .join('');

const relationshipDimensions = t.relationships.dimensions
  .map((group) => `<li><strong>${esc(group.label)}</strong>: ${group.items.map(esc).join(', ')}</li>`)
  .join('');

const luxFormats = t.luxAperta.formats
  .map((format, i) => {
    const facts = format.facts
      ? `<ul>${format.facts.map((f) => `<li>${esc(f.label)}: ${esc(f.value)}</li>`).join('')}</ul>`
      : '';
    const anchor = slugify(en.luxAperta.formats[i].title);
    return `<h3 id="${anchor}">${esc(format.title)} · ${esc(format.tagline)}</h3>${format.paragraphs.map(p).join('')}${facts}`;
  })
  .join('');

// The [data-snapshot] wrapper is hidden by CSS when the inline head script has
// tagged <html> with the js class, so browsers never flash the raw snapshot;
// clients without JavaScript still render it.
const staticHtml = `<div id="root">
<div data-snapshot>
<header id="intro">
<h1>${esc(t.intro.h1)}</h1>
${p(t.intro.h2)}
<nav><a href="https://github.com/pajew-ski">GitHub</a> · <a href="https://youtube.com/@m_pajew_ski">YouTube</a> · <a href="/llms.txt">llms.txt</a> · <a href="/llms-full.txt">llms-full.txt</a></nav>
</header>
<main>
<section id="opus-purum">
<h2>${esc(t.opusPurum.h2)}</h2>
${p(t.opusPurum.subtitle)}
${p(t.opusPurum.premise)}
${opusChapters}
</section>
<section id="principles">
<h2>${esc(t.principles.h2)}</h2>
${p(t.principles.copy)}
${moduleHtml(t.principles.modules.moduleCognition, en.principles.modules.moduleCognition)}
${moduleHtml(t.principles.modules.moduleBeing, en.principles.modules.moduleBeing)}
${moduleHtml(t.principles.modules.moduleDoing, en.principles.modules.moduleDoing)}
</section>
<section id="exocortex">
<h2>${esc(t.exocortex.h2)}</h2>
${p(t.exocortex.copy)}
<ul>${Object.entries(t.exocortex.stack)
  .map(
    ([key, item]) =>
      `<li id="${slugify(en.exocortex.stack[key].title)}"><strong>${esc(item.title)}</strong>: ${esc(item.desc)}</li>`
  )
  .join('')}</ul>
</section>
<section id="relationships">
<h2>${esc(t.relationships.h2)}</h2>
${p(t.relationships.copy)}
<ul>${relationshipPrinciples}</ul>
<h3 id="${slugify(en.relationships.dimensionsTitle)}">${esc(t.relationships.dimensionsTitle)}</h3>
${p(t.relationships.dimensionsIntro)}
<ul>${relationshipDimensions}</ul>
</section>
<section id="lux-aperta">
<h2>${esc(t.luxAperta.h2)}</h2>
${p(t.luxAperta.subtitle)}
<p><em>${esc(t.luxAperta.lead)}</em></p>
${t.luxAperta.paragraphs.map(p).join('')}
${luxFormats}
</section>
</main>
<footer>
${p(t.siteFooter)}
<p>${esc(t.aiContext)} <a href="/llms.de.txt">llms.de.txt</a> · <a href="/llms-full.de.txt">llms-full.de.txt</a> · <a href="/llms.txt">llms.txt</a> · <a href="/llms-full.txt">llms-full.txt</a></p>
</footer>
</div>
</div>`;

const indexPath = resolve(root, 'dist/index.html');
let indexHtml = readFileSync(indexPath, 'utf8');
if (!indexHtml.includes('<div id="root"></div>')) {
  throw new Error('dist/index.html: empty root container not found; prerender aborted');
}
indexHtml = indexHtml.replace('<div id="root"></div>', staticHtml);

// Inline the entry stylesheet: GitHub Pages cannot send preload headers, so
// the render-blocking CSS request would cost an extra round trip before
// first paint. The hashed file stays in dist/ for already-cached HTML.
const cssLink = indexHtml.match(
  /<link rel="stylesheet"[^>]*href="\/(assets\/index-[^"]+\.css)"[^>]*>/
);
if (!cssLink) {
  throw new Error('dist/index.html: entry stylesheet link not found; prerender aborted');
}
const css = readFileSync(resolve(root, 'dist', cssLink[1]), 'utf8').trim();
indexHtml = indexHtml.replace(cssLink[0], `<style>${css}</style>`);

writeFileSync(indexPath, indexHtml);

const stamp = new Date().toISOString().slice(0, 10);
for (const file of ['llms.txt', 'llms-full.txt', 'llms.de.txt', 'llms-full.de.txt']) {
  const filePath = resolve(root, 'dist', file);
  const lines = readFileSync(filePath, 'utf8').split('\n');
  lines.splice(1, 0, '', `Updated: ${stamp}`);
  writeFileSync(filePath, lines.join('\n'));
}

// Stamp every sitemap <lastmod> with the build date so the source file needs no
// manual date edits and CDN caches stay honest, mirroring the llms stamps above.
const sitemapPath = resolve(root, 'dist', 'sitemap.xml');
const sitemap = readFileSync(sitemapPath, 'utf8');
writeFileSync(
  sitemapPath,
  sitemap.replace(/<lastmod>[^<]*<\/lastmod>/g, `<lastmod>${stamp}</lastmod>`)
);

console.log(`prerender: static snapshot injected, llms files + sitemap stamped (${stamp})`);
