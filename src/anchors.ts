import en from './locales/en.json';

// Anchor slugs derive from the English titles so every heading keeps the same
// id in both languages. Renaming an English title therefore changes its
// anchor; `npm run check:site` asserts existence and uniqueness of all slugs.
export const slugify = (text: string): string =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

// English source content, used only to compute language-independent slugs.
export const enContent = en;

// Quiet self-link affordance shared by every linkable heading: no glyph, only
// a pointer cursor and an underline that fades in on hover.
export const anchorLinkClass =
  'underline decoration-1 underline-offset-[0.25em] decoration-transparent transition-colors duration-300 hover:decoration-foreground/30 focus-visible:decoration-foreground/40';
