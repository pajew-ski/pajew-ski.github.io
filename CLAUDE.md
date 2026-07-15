# CLAUDE.md – pajew.ski

## Project Overview

Michael's personal web card (SPA): React 19, TypeScript (strict), Vite, Tailwind CSS.
Monochromatic grayscale design with an animated Krystal Flower logo (SVG), Framer Motion, and embedded N8N chat.

Purpose of the site: a fully transparent self-description for human visitors, mirrored one-to-one in `public/llms.txt` and `public/llms-full.txt` so AI systems can use the same knowledge for grounding.

## Commands

- `npm run build`: TypeScript check + Vite production build + prerender step (must pass before committing)
- `npm run lint`: ESLint (flat config, strict TS rules)
- `npm run dev`: Dev server

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

## Prerendering & AI Discovery

The site is a CSR SPA; without countermeasures, non-JS fetchers (most AI agents, scrapers) would receive an empty `<div id="root">`. Therefore:

- `scripts/prerender.mjs` runs as part of `npm run build`. It generates a static HTML snapshot of the full site content from `src/locales/de.json` (same source of truth as the app) and injects it into `dist/index.html` inside `#root`, wrapped in `[data-snapshot]`. React replaces the snapshot on mount; the interactive app is unaffected.
- Browsers never flash the snapshot: the inline head script tags `<html>` with a `js` class before first paint and `index.css` hides `[data-snapshot]` under `.js`. Clients without JavaScript render the snapshot as before. Keep script, wrapper, and CSS rule in sync.
- The script also stamps all four llms files in `dist/` (`llms.txt`, `llms-full.txt`, `llms.de.txt`, `llms-full.de.txt`) with an `Updated: YYYY-MM-DD` line (build date) so stale CDN caches are recognizable. The source files in `public/` carry no stamp.
- Because the snapshot is generated from `de.json`, it needs no manual syncing; new sections must be added to the script's section list, though.
- Discovery: `public/robots.txt` points to `public/sitemap.xml`, which lists `/` and all four llms files; robots.txt also names them in a comment. `index.html` carries `<link rel="llms.txt">` and a meta description. The app footer links the llms files of the active language; the English and German llms files cross-reference each other.

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
- Framer Motion for all animations (`initial`, `whileInView`, `viewport={{ once: true }}`)
- Tailwind utilities only (no CSS modules, no inline styles)
- `clsx` + `tailwind-merge` for conditional classnames
- Accessibility: `aria-label`, `aria-labelledby`, `aria-expanded`, `tabIndex`, semantic HTML, keyboard handlers

## Styling

- Monochromatic grayscale, no color hues. All HSL values use `0 0% X%`.
- Dark mode via `class` strategy (`<html class="dark">`), automatic only: it follows `prefers-color-scheme`, there is no manual toggle. The class is set before first paint by an inline script in `index.html` and kept in sync by `ThemeProvider`.
- Colors defined as CSS variables in `src/index.css` (`:root` and `.dark`)
- System font stack, no web fonts
- Responsive: mobile-first with `md:` and `lg:` breakpoints

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
