# CLAUDE.md – pajew-ski.github.io

## Project Overview

Michael's personal web card (SPA): React 19, TypeScript (strict), Vite, Tailwind CSS.
Monochromatic grayscale design with an animated Krystal Flower logo (SVG), Framer Motion, and embedded N8N chat.

Purpose of the site: a fully transparent self-description for human visitors, mirrored one-to-one in `public/llms.txt` and `public/llms-full.txt` so AI systems can use the same knowledge for grounding.

## Commands

- `npm run build`: TypeScript check + Vite production build (must pass before committing)
- `npm run lint`: ESLint (flat config, strict TS rules)
- `npm run dev`: Dev server

## Content Sync Rule (Critical)

All visible text lives in the i18n translation files. When content changes, **all five files must be updated together**:

| File | Purpose |
|---|---|
| `src/locales/de.json` | German translations (primary language) |
| `src/locales/en.json` | English translations (must mirror de.json structure exactly) |
| `public/llms.txt` | LLM-facing site summary |
| `public/llms-full.txt` | LLM-facing full site content |
| `SYSTEM_PROMPT.md` | System prompt for the embedded chat agent (copy to N8N separately) |

Never add text directly in components; always use `t('key')` from `react-i18next`.

## Writing Style (Critical)

The copy must read as written by a person, not generated:

- No em-dashes in any visible text or LLM-facing file; use periods, commas, colons, or semicolons
- No "not X, but Y" antithesis chains; use the contrast only where it is the actual point
- No dramatic one-word fragment endings ("Not a metaphor.") outside deliberately kept manifesto lines
- No grandiose self-description; plain, concrete claims
- German copy avoids unnecessary anglicisms and consulting jargon

## Site Structure (Sections)

Ordered inside-out: worldview, principles, own infrastructure, relationships, open spaces.
Each section element carries an `id` matching the anchors used in `llms.txt`.

1. **Hero** (`#hero`): Name, tagline, Krystal Flower animation
2. **OpusPurum** (`#opus-purum`): Axiomatic framework, accordion with 8 chapters
3. **Principles** (`#principles`, heading "Prinzipien"): three modules
   - Erkennen/Cognition: 4 sequential formal axioms (single-column layout)
   - Sein/Being: 12 principles (3-column grid)
   - Tun/Doing: 12 principles (3-column grid)
4. **Exocortex** (`#exocortex`): Technical infrastructure (Orchestration, Memory & Inference, Operations)
5. **Relationships** (`#relationships`, heading "Beziehungen"): relationship anarchy, 6 principle cards (reuses `PrincipleCard`) + building-block chips + source link
6. **LuxAperta** (`#lux-aperta`): Lux Aperta Bavaria community text + format cards (Iter Apertum, Convivium Apertum)
7. **Chat Widget**: N8N-powered assistant
8. **Footer**: Legal modal, site footer text

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
- Dark mode via `class` strategy (`<html class="dark">`)
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
- Build must pass (`npm run build`) before pushing
- Node version: 20
