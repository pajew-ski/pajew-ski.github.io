# CLAUDE.md – pajew.ski

## Project Overview

Michael's personal web card (SPA): React 19, TypeScript (strict), Vite, Tailwind CSS.
Monochromatic grayscale design with an animated Krystal Flower logo (SVG), Framer Motion, and embedded N8N chat.

Purpose of the site: a fully transparent self-description for human visitors, mirrored one-to-one in `public/llms.txt` and `public/llms-full.txt` so AI systems can use the same knowledge for grounding.

## Commands

- `npm run build`: TypeScript check + Vite production build + prerender step (must pass before committing)
- `npm run lint`: ESLint (flat config, strict TS rules)
- `npm run dev`: Dev server
- `npm run check:site`: Reader-mode extraction + axe accessibility scans (light/dark, mobile/desktop); needs a fresh build
- `npm run check:lighthouse`: Lighthouse with thresholds (performance >= 90, accessibility/best-practices/SEO = 100); set `CHROME_PATH` if no system Chrome
- `npm run check`: build + both checks. CI runs all of this on every push (`.github/workflows/checks.yml`); run `check:site` locally before committing changes to markup or interactions

## Content Sync Rule (Critical)

All visible text lives in the i18n translation files. When content changes, **all seven files must be updated together**:

| File | Purpose |
|---|---|
| `src/locales/de.json` | German translations (primary language) |
| `src/locales/en.json` | English translations (must mirror de.json structure exactly) |
| `public/llms.txt` | LLM-facing site summary (English, canonical) |
| `public/llms-full.txt` | LLM-facing full site content (English) |
| `public/llms.de.txt` | LLM-facing site summary (German) |
| `public/llms-full.de.txt` | LLM-facing full site content (German) |
| `SYSTEM_PROMPT.md` | System prompt for the embedded chat agent (copy to N8N separately) |

Never add text directly in components; always use `t('key')` from `react-i18next`.

## Writing Style (Critical)

The copy must read as written by a person, not generated:

- No em-dashes in any visible text or LLM-facing file; use periods, commas, colons, or semicolons
- No "not X, but Y" antithesis chains; use the contrast only where it is the actual point
- No dramatic one-word fragment endings ("Not a metaphor.") outside deliberately kept manifesto lines
- No grandiose self-description; plain, concrete claims
- German copy avoids unnecessary anglicisms and consulting jargon

## Links & Attribution (Critical)

This site is purely Michael's personal profile and web card, with its AI features. It links to Michael and nothing else.

- Only Michael's own profiles and destinations may be linked (for example his GitHub profile, YouTube channel, other contact channels). No links to external websites.
- No external names, organizations, or sources in any visible text or LLM-facing file. Concepts are described in Michael's own words, as they are generally understood today, without citing an outside source.
- This applies to all seven content files and to the embedded chat's system prompt.

## Design & Proportion (Critical)

Guiding premise for all work on this site: natural beauty and semantic purity first. The first impression of every view must be pure beauty, on desktop and on mobile alike. This is a standing requirement, not a per-task instruction: every session that adds or changes anything visible applies and verifies the rules below proactively, without being asked.

- Proportions derive from the golden ratio (φ ≈ 1.618). Macro composition uses the φ ladder in vmin (100, 61.8, 38.2, 23.6, 14.6, 9, 5.6); element spacing uses the named Tailwind tokens `phi-3xs` … `phi-6xl` (powers of √φ in rem, see `tailwind.config.js`). Pick values from these ladders instead of inventing new ones.
- The type scale keeps the default Tailwind names but every size is a power of φ^(1/4) rem (base 1rem, see `tailwind.config.js`); line heights step from φ for running text down to 1 for display sizes. No ad-hoc pixel sizes; rely on the per-size line heights instead of `leading-*` utilities. The intro tagline's `text-[0.694rem]` (φ^(-3/4)) is the only sub-xs step.
- Viewport-relative units (vmin) keep proportions identical across devices; fixed values only as caps or floors (e.g. `max-w`, `min(...)`, `max(...)`).
- Section shell, identical for every content section: `py-[max(14.6vmin,6.854rem)]`, header `mb-phi-5xl space-y-phi-lg`, h2 `text-4xl md:text-6xl font-bold tracking-tighter`, lead copy `text-xl md:text-2xl max-w-3xl font-light`, card grids `gap-phi-xl`, uppercase micro-labels `tracking-[0.3em]`.
- Vertical composition is optically centred: free space above : below = 1 : φ. Reference implementation: `Intro.tsx` (flower diameter 61.8vmin capped at 32rem, text gap 9vmin, spacers `grow` and `grow-[1.618]`).
- Whitespace is a design element; prefer removing elements over adding. No helper graphics, no decoration without meaning. The Krystal Flower consists of its 24 curves and nothing else.
- Semantic purity: semantic HTML, minimal DOM, no wrapper elements without purpose; ids, i18n keys, and component names stay aligned (see Component Conventions).
- Every visual change is verified with headless-browser screenshots before committing: mobile (390×844) and desktop (1440×900), each in light and dark mode. Animations are checked mid-run too, not only in their final state; WebKit has mis-rendered animated `stroke-dasharray` (motion's `pathLength`) here before, so avoid dash-based drawing.
- Dark mode must never flash: an inline script in `index.html` sets the `dark` class before first paint. Keep it intact.

## Site Structure (Sections)

Ordered inside-out: worldview, principles, own infrastructure, relationships, open spaces.
Each section element carries an `id` matching the anchors used in `llms.txt`. Every content section's `h2` is a self-link to that `id` (the heading text is wrapped in an `<a href="#id">`), so each section is directly shareable. The affordance stays deliberately quiet: no glyph, only a pointer cursor and a faint underline that fades in on hover; never add a visible anchor icon.

1. **Intro** (`#intro`): Name, tagline, Krystal Flower animation
2. **OpusPurum** (`#opus-purum`): Axiomatic framework, accordion with 8 chapters
3. **Principles** (`#principles`, heading "Prinzipien"): three modules
   - Erkennen/Cognition: 4 sequential formal axioms (single-column layout)
   - Sein/Being: 12 principles (3-column grid)
   - Tun/Doing: 12 principles (3-column grid)
4. **Exocortex** (`#exocortex`): Technical infrastructure (Orchestration, Memory & Inference, Operations)
5. **Relationships** (`#relationships`, heading "Beziehungen"): relationship anarchy, 6 principle cards (reuses `PrincipleCard`) + building-block chips + source link
6. **LuxAperta** (`#lux-aperta`): Lux Aperta Bavaria community text + format cards (Iter Apertum, Convivium Apertum)
7. **Chat Widget**: N8N-powered assistant
8. **Footer**: Language switcher (EN/DE), legal modal, site footer text, links to `/llms.txt` and `/llms-full.txt`

## Reader Mode & Content Extraction (Critical)

The page must extract completely in browser reader modes. There is no standard: Safari, Firefox (Readability.js), and Chromium-family readers (including Vivaldi) each use their own heuristics, so the markup has to satisfy the common denominator. These rules exist because each one was violated and produced a real reader-mode bug:

- All text stays in the DOM at all times. Never conditionally mount content (no `AnimatePresence` around body text) and never collapse it with inline styles (`height: 0`, `opacity: 0`, Framer Motion height animations); some extractors read inline styles as hidden. Collapse via CSS classes only, using the grid-rows pattern: outer `grid grid-rows-[0fr]/[1fr] opacity-0/100 transition-[grid-template-rows,opacity]`, inner `overflow-clip min-h-0`.
- No class name may contain the substring `hidden` (Readability scores it as boilerplate and deletes the element). Use `overflow-clip`, never `overflow-hidden`.
- Never put a heading inside a `<button>` (extractors strip buttons wholesale) and never put `aria-expanded` on non-widget elements. Disclosure pattern: the heading contains a `span role="button"` with `tabIndex`, `aria-expanded`, `aria-controls`, and Enter/Space handling; pointer clicks may additionally be handled on the surrounding row or card.
- Decorative glyphs (the accordion `+`) are CSS pseudo-elements (`after:content-['+']`), never DOM text nodes; Safari extracts DOM text even under `aria-hidden`.
- Adjacent heading fragments in separate spans need a real separator (`sr-only` span with a text separator); CSS gaps do not exist in extracted text.
- The whole card is wrapped in `<main><article>` so extractors anchor on the h1 instead of electing an inner heading as the article title.
- `npm run check:site` asserts all of this (every heading and every body string from the locale files must survive extraction) and must pass before committing.

## Prerendering & AI Discovery

The site is a CSR SPA; without countermeasures, non-JS fetchers (most AI agents, scrapers) would receive an empty `<div id="root">`. Therefore:

- `scripts/prerender.mjs` runs as part of `npm run build`. It generates a static HTML snapshot of the full site content from `src/locales/de.json` (same source of truth as the app) and injects it into `dist/index.html` inside `#root`, wrapped in `[data-snapshot]`. React replaces the snapshot on mount; the interactive app is unaffected.
- Browsers never flash the snapshot: the inline head script tags `<html>` with a `js` class before first paint and `index.css` hides `[data-snapshot]` under `.js`. Clients without JavaScript render the snapshot as before. Keep script, wrapper, and CSS rule in sync.
- The script also stamps all four llms files in `dist/` (`llms.txt`, `llms-full.txt`, `llms.de.txt`, `llms-full.de.txt`) with an `Updated: YYYY-MM-DD` line (build date) so stale CDN caches are recognizable. The source files in `public/` carry no stamp.
- The script also inlines the built entry stylesheet into `dist/index.html` and removes the `<link rel="stylesheet">`, so first paint needs no render-blocking CSS request. The hashed CSS file stays in `dist/` for browsers still holding previously cached HTML.
- Because the snapshot is generated from `de.json`, it needs no manual syncing; new sections must be added to the script's section list, though.
- Discovery: `public/robots.txt` points to `public/sitemap.xml`, which lists `/` and all four llms files; robots.txt also names them in a comment. `index.html` carries `<link rel="llms.txt">` and a meta description. The app footer links the llms files of the active language; the English and German llms files cross-reference each other.

## Discoverability & Semantic Web (Critical)

This site is Michael Pajewski's public identity for humans, search engines, and AI systems alike. Every session that touches content, links, or the head must keep the machine-readable layer truthful and in sync. This is a standing requirement, applied proactively, not per task.

- The `<head>` in `index.html` is the semantic anchor. Keep in sync with the actual content and with each other: the `<title>`, `meta[name=description]`, the JSON-LD `@graph` (Person + WebSite), Open Graph tags, and Twitter Card tags. When a self-description, job, location, language, or profile link changes, update the JSON-LD (`jobTitle`, `knowsAbout`, `knowsLanguage`, `address`, `sameAs`) in the same pass. `sameAs` and OG/Twitter follow the same Links & Attribution rule: only Michael's own destinations, no external names or organizations.
- `<link rel="canonical">` stays `https://pajew.ski/`. The site is one canonical URL; the language switch is client-side, so there are no per-language URLs and therefore no `hreflang` page alternates for HTML. The markdown alternate links carry `hreflang` for the llms files; their `href` values must stay absolute (Lighthouse rejects relative hreflang URLs).
- The social preview image is `public/og-image.png` (1200x630 at 2x), referenced by `og:image` and `twitter:image` (`summary_large_image`). It is a committed static asset, not built by `npm run build`. Regenerate it with `node scripts/generate-og-image.mjs` when the name, tagline, or card design changes; that script reproduces the Krystal Flower with the exact math from `KrystalFlower.tsx`, so keep the two in sync (24 spirals, same opacities, monochrome, pure-black dark background). Update the `og:image:width`/`height` tags if the output dimensions change.
- The llms files are the HTML-free Markdown mirror of the site and are declared via `<link rel="alternate" type="text/markdown">`. That is the supported clean-content mechanism. Do not attempt a dynamic `.md`-suffix feature: GitHub Pages is a static host with no content negotiation, and per-section `.md` files would only duplicate `llms-full.txt` while multiplying the content-sync surface.
- `public/sitemap.xml` lists only real, fetchable URLs (`/` and the four llms files). Never add fragment URLs (`/#section`): search engines strip the fragment and treat them as duplicates of `/`. All `<lastmod>` values are stamped with the build date by `scripts/prerender.mjs`; leave the source dates as placeholders and let the build overwrite them.
- New sections: add the `id`/`h2` self-link (see Site Structure), the anchor in `llms.txt`, and the section to the prerender script's section list. Sections are made shareable through anchors and the prerender snapshot, not through the sitemap.

## Performance (Critical)

The Lighthouse mobile score is kept at the top of the green range. Standing rules:

- The chat bundle (`@n8n/chat` plus its Vue runtime, roughly two thirds of all JavaScript) must never be imported eagerly. Only `src/chat.ts` imports it; `ChatWidget` loads that chunk on the first user interaction, with a timer 6 s after `load` as fallback. This keeps the chat out of the critical path and out of the lab metrics window.
- Framer Motion loads through `LazyMotion` with `domAnimation` in strict mode (see Component Conventions); importing `motion.*` anywhere throws at runtime and would pull the full bundle back in.
- Scroll reveals use the shared presets in `src/motion.ts`. The viewport pre-trigger margin and the capped stagger delays are what keep cards from sitting blank inside the viewport; do not reintroduce long per-index delays or default viewport configs.
- Elements animated by Framer Motion must not also have CSS transitions on `opacity` or `transform` (no `transition-all` on animated cards); the two systems fight and the animation stutters.
- The n8n chat theme overrides in `src/index.css` use doubled `:root:root` selectors because the chat stylesheet loads after `index.css`; keep the doubling, load order no longer decides the cascade.
- `index.html` preconnects to `https://n8n.pajewski.net` for the deferred webhook call.

## i18n

- Framework: `i18next` + `react-i18next` + browser language detector
- Languages: `de` (German), `en` (English, fallback)
- Files: `src/locales/{de,en}.json`
- Usage: `const { t } = useTranslation()` in all components
- Nested objects: `t('key', { returnObjects: true }) as Type`
- Both JSON files must have identical key structure at all times
- `document.documentElement.lang` is kept in sync in `src/i18n.ts`

## Component Conventions

- Functional components with TypeScript interfaces
- Component file names, i18n keys, and section ids match the section they render (e.g. `Principles.tsx`, key `principles`, id `#principles`)
- Framer Motion for scroll reveals and load animations, via `LazyMotion` (`domAnimation`, strict) in `App.tsx`: always `m.*` components, never `motion.*`. Scroll reveals combine `initial`, `whileInView`, `viewport={viewportOnce}` and `transition={reveal(delay)}` from `src/motion.ts`. Expand/collapse is the one exception: it uses the CSS grid-rows pattern (see Reader Mode section), never Framer height animations
- Tailwind utilities only (no CSS modules, no inline styles)
- `clsx` + `tailwind-merge` for conditional classnames
- Accessibility: `aria-label`, `aria-labelledby`, `aria-expanded`, `tabIndex`, semantic HTML, keyboard handlers

## Styling

- Monochromatic grayscale, no color hues. All HSL values use `0 0% X%`.
- Dark mode via `class` strategy (`<html class="dark">`), automatic only: it follows `prefers-color-scheme`, there is no manual toggle. The class is set before first paint by an inline script in `index.html` and kept in sync by `ThemeProvider`.
- Colors defined as CSS variables in `src/index.css` (`:root` and `.dark`)
- System font stack, no web fonts
- Responsive: mobile-first with `md:` and `lg:` breakpoints
- Contrast is WCAG AA everywhere: `--muted-foreground` stays at 42% lightness in light mode (anything lighter fails 4.5:1 on the neutral-100 section background), and muted text never gets an additional opacity reduction

## TypeScript

- Strict mode enabled (`noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`)
- Target: ES2022
- No `any` types

## Git & Deployment

- Branch naming: `claude/<description>-<id>` for Claude-generated branches
- CI/CD: GitHub Actions deploys `dist/` to GitHub Pages on push to main/master
- Repo setting: Pages source must stay on "GitHub Actions". The legacy "Deploy from a branch" mode publishes the raw source tree (blank page) and races against the workflow deployment.
- `deploy.yml` carries the previously live hashed assets into each new deployment so browsers holding the 10-minute-cached HTML never hit deleted assets.
- Build must pass (`npm run build`) before pushing
- Node version: 20
