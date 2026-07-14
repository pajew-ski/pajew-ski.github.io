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

const MANIFESTO_URL =
  'https://theanarchistlibrary.org/library/andie-nordgren-the-short-instructional-manifesto-for-relationship-anarchy';

const esc = (s) =>
  String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

const p = (text) => `<p>${esc(text)}</p>`;

function moduleHtml(mod) {
  const items = mod.list
    .map((item) => `<li><strong>${esc(item.title)}</strong>: ${esc(item.desc)}</li>`)
    .join('');
  return `<h3>${esc(mod.title)}</h3><ul>${items}</ul>`;
}

const opusChapters = t.opusPurum.chapters
  .map((chapter) => {
    const entries = chapter.content
      .map((entry) =>
        entry.heading ? `<h4>${esc(entry.heading)}</h4>${p(entry.body)}` : p(entry.body)
      )
      .join('');
    return `<h3>${esc(chapter.label)} · ${esc(chapter.title)}</h3>${entries}`;
  })
  .join('');

const relationshipPrinciples = t.relationships.principles
  .map((item) => `<li><strong>${esc(item.title)}</strong>: ${esc(item.desc)}</li>`)
  .join('');

const relationshipDimensions = t.relationships.dimensions
  .map((group) => `<li><strong>${esc(group.label)}</strong>: ${group.items.map(esc).join(', ')}</li>`)
  .join('');

const luxFormats = t.luxAperta.formats
  .map((format) => {
    const facts = format.facts
      ? `<ul>${format.facts.map((f) => `<li>${esc(f.label)}: ${esc(f.value)}</li>`).join('')}</ul>`
      : '';
    return `<h3>${esc(format.title)} · ${esc(format.tagline)}</h3>${format.paragraphs.map(p).join('')}${facts}`;
  })
  .join('');

const staticHtml = `<div id="root">
<header id="hero">
<h1>${esc(t.hero.h1)}</h1>
${p(t.hero.h2)}
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
${moduleHtml(t.principles.modules.moduleCognition)}
${moduleHtml(t.principles.modules.moduleBeing)}
${moduleHtml(t.principles.modules.moduleDoing)}
</section>
<section id="exocortex">
<h2>${esc(t.exocortex.h2)}</h2>
${p(t.exocortex.copy)}
<ul>${Object.values(t.exocortex.stack)
  .map((item) => `<li><strong>${esc(item.title)}</strong>: ${esc(item.desc)}</li>`)
  .join('')}</ul>
</section>
<section id="relationships">
<h2>${esc(t.relationships.h2)}</h2>
${p(t.relationships.copy)}
<ul>${relationshipPrinciples}</ul>
<h3>${esc(t.relationships.dimensionsTitle)}</h3>
${p(t.relationships.dimensionsIntro)}
<ul>${relationshipDimensions}</ul>
<p>${esc(t.relationships.source)} <a href="${MANIFESTO_URL}">${esc(t.relationships.sourceLinkLabel)}</a></p>
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
</div>`;

const indexPath = resolve(root, 'dist/index.html');
const indexHtml = readFileSync(indexPath, 'utf8');
if (!indexHtml.includes('<div id="root"></div>')) {
  throw new Error('dist/index.html: empty root container not found; prerender aborted');
}
writeFileSync(indexPath, indexHtml.replace('<div id="root"></div>', staticHtml));

const stamp = new Date().toISOString().slice(0, 10);
for (const file of ['llms.txt', 'llms-full.txt', 'llms.de.txt', 'llms-full.de.txt']) {
  const filePath = resolve(root, 'dist', file);
  const lines = readFileSync(filePath, 'utf8').split('\n');
  lines.splice(1, 0, '', `Updated: ${stamp}`);
  writeFileSync(filePath, lines.join('\n'));
}

console.log(`prerender: static snapshot injected, llms files stamped (${stamp})`);
