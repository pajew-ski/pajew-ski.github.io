# CLAUDE.md – pajew.ski

## Purpose

pajew.ski holds what anyone may take: Opus Purum, the open formats, and the open-source projects. The site shows the work and leaves out the person: no name, no self-description, no principles, no relationships, no meeting points, no chat. A section enters only if a reader can take it away and use it without the author.

Since 23.11.2026 the site has no build. `site/` is the published form, written by hand: one `index.html` with inline CSS and two small inline scripts, the four llms files, `sitemap.xml`, `robots.txt`, `favicon.svg`, `og-image.png`, `CNAME`. `deploy.yml` uploads `site/` as it stands. npm carries only the check tools.

## Commands

- `npm run serve`: serves `site/` on 127.0.0.1:4173 as Pages does
- `npm run check:site`: own origin, Albedo, anchors, language, reader mode, layout at 360/390/1440 px light and dark, axe (needs Chrome; `CHROME_PATH` overrides)
- `npm run check:lighthouse`: performance >= 90, accessibility, best practices and SEO = 100
- `node scripts/generate-og-image.mjs`: redraws `site/og-image.png` when the title or the card changes

CI runs both checks on every push (`checks.yml`). A failing check never blocks a deploy.

## Content sync

Visible text lives in `site/index.html`, once per language. When content changes, update in the same pass: `index.html` (both languages), `llms.txt`, `llms.de.txt`, `llms-full.txt`, `llms-full.de.txt`, and the JSON-LD and meta tags in the head when a project page is added or removed. `sitemap.xml` lists only fetchable URLs (`/`, the llms files, the project pages); `lastmod` is set by hand on a content change.

## Language

Both languages ship in the same file, as in the open family. Prose exists as sibling elements with `lang="de"` and `lang="en"`; one CSS rule hides the language that does not match `<html lang>`. A classic script in the head sets `<html lang>` before first paint: German when the browser's first language starts with `de`, English otherwise; `?lang=de` or `?lang=en` overrides. Without script the page is German. There is no language switch and no theme switch.

## Writing style

- No em dashes in any visible text or llms file; use periods, commas, colons, semicolons.
- No "not X, but Y" chains unless the contrast is the point; no dramatic fragment endings.
- No self-description. The work speaks in its own register: Opus Purum impersonal, the formats in "wir" as a practice description, the projects in plain third person.
- One vocabulary for one territory: Opus Purum's process-philosophical language (attractor, Logos, order-direction, coherence, alignment); no parallel idiom for the same ideas.

## Links and attribution

The site links to its own projects and to github.com/pajew-ski, nothing else. No external names, organizations, or sources in visible text or llms files.

## Design: Albedo

The inline stylesheet begins with the Albedo token block, `/* albedo: Anfang */` to `/* albedo: Ende */`, byte for byte as in the open family (temet-nosce, open-entrainer, open-desensitizer, open-helix). Rules outside the block use its tokens only:

- Achromatic: five tones in oklch with chroma 0, light and dark from `prefers-color-scheme`. pajew.ski is outside the Exocortex and carries no brand color. `check:site` rejects chroma, hex, rgb and hsl outside the block.
- Measure from 2: spacing `--step-2` to `--step-7` (4 to 128 px), type `--type-sm`, `--type-0` to `--type-4`, line height √2, shell 1024 px, text column 32 rem. Macro composition in powers of two in vmin.
- Intro: the Krystal Flower is the centre (G1). Free space above : below = 1 : √2. The flower is drawn by the first script at the end of `index.html` (24 log spirals r = r0 · 2^(2θ/π)) and revealed by a growing `clip-path` circle; never animate stroke dashes, WebKit mis-renders them on these paths.
- Sections alternate bg and surface. A card on bg is a surface band of `--step-3` around a bg interior (G2); inside a surface section the section is the band. Cards in a row are equally high.
- Opus Purum is `<details name="opus-purum">`: one chapter open at a time, the first open by default. Opening glides via `::details-content`, closing is immediate. A summary may not contain a link, so chapters have ids but no self-link; the second script opens a chapter on a deep link and brings an opened heading back into view.
- Every section `h2` and every card `h3` is a quiet self-link (`a.self`) to its id. Anchors: `#opus-purum`, `#opus-purum-<english-title-slug>`, `#open-formats`, `#iter-apertum`, `#convivium-apertum`, `#speculum-apertum`, `#projects`, `#<project-slug>`.
- Reflow: at 360 px only vertical scrolling. Every visual change is checked with screenshots at 360 and 1440 px, light and dark, before committing.

## Reader mode

All text stays in the DOM. No class name contains `hidden`. Decorative glyphs are pseudo-elements. Adjacent heading fragments carry an `sr-only` separator. The page is wrapped in `<main><article>`. `check:site` asserts that Readability keeps every heading.

## Git and deployment

- Branches `claude/<description>`; Michael merges.
- Pages source stays on "GitHub Actions"; the branch mode would publish the repository root instead of `site/`.
- The project pages under the same domain (`/temet-nosce/`, `/open-entrainer/`, `/open-desensitizer/`, `/open-helix/`) deploy from their own repositories and need this repository's custom domain; `site/CNAME` and the domain setting stay.
