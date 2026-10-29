import { m } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState } from 'react';
import { anchorLinkClass, enContent, slugify } from '../anchors';
import { reveal, viewportOnce } from '../motion';

interface ChapterEntry {
  heading: string;
  body: string;
}

interface Chapter {
  id: string;
  label: string;
  title: string;
  content: ChapterEntry[];
}

const chapterAnchors = enContent.opusPurum.chapters.map(
  (chapter) => `opus-purum-${slugify(chapter.title)}`
);

// Opening a chapter collapses the previously open one, which reflows the page
// while both grid-rows transitions run. To keep orientation, the opened
// heading glides to the top of the viewport and is re-measured every frame,
// so the moving layout underneath cannot drag it around. Any user scroll
// input cancels the glide.
const PANEL_TRANSITION_MS = 350;
const GLIDE_MS = 500; // pins a little past the panel transition to absorb timing drift

function glideHeadingToTop(heading: HTMLElement): () => void {
  const margin = parseFloat(getComputedStyle(heading).scrollMarginTop) || 0;
  const startTop = heading.getBoundingClientRect().top;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const start = performance.now();
  let frame = 0;

  const cancel = () => {
    cancelAnimationFrame(frame);
    window.removeEventListener('wheel', cancel);
    window.removeEventListener('touchstart', cancel);
  };

  const step = (now: number) => {
    const t = Math.min((now - start) / PANEL_TRANSITION_MS, 1);
    const eased = reduceMotion ? 1 : 1 - Math.pow(1 - t, 3);
    const desiredTop = startTop + (margin - startTop) * eased;
    // 'instant' opts out of the page's `scroll-behavior: smooth`, which would
    // otherwise animate every frame's correction and let the pin lag behind.
    window.scrollTo({
      top: window.scrollY + heading.getBoundingClientRect().top - desiredTop,
      behavior: 'instant',
    });
    if (now - start < GLIDE_MS) {
      frame = requestAnimationFrame(step);
    } else {
      cancel();
    }
  };

  window.addEventListener('wheel', cancel, { passive: true });
  window.addEventListener('touchstart', cancel, { passive: true });
  frame = requestAnimationFrame(step);
  return cancel;
}

export function OpusPurum() {
  const { t } = useTranslation();
  const chapters = t('opusPurum.chapters', { returnObjects: true }) as Chapter[];
  // Deep links open the targeted chapter (#opus-purum-axioms etc.); reading
  // the hash in the initializer keeps the first paint layout-stable for the
  // fragment scroll.
  const [openId, setOpenId] = useState<string>(() => {
    const index = chapterAnchors.indexOf(window.location.hash.slice(1));
    return chapters[index >= 0 ? index : 0]?.id ?? '';
  });

  const toggle = (id: string) => setOpenId((prev) => (prev === id ? '' : id));

  useEffect(() => {
    const openFromHash = () => {
      const index = chapterAnchors.indexOf(window.location.hash.slice(1));
      if (index >= 0) setOpenId(chapters[index]?.id ?? '');
    };
    window.addEventListener('hashchange', openFromHash);
    return () => window.removeEventListener('hashchange', openFromHash);
  }, [chapters]);

  // Glide only on a change to a newly opened chapter, never on mount: on a
  // deep-linked first paint the browser's own fragment scroll already
  // positions the heading, and the initializer opened it layout-stable.
  const prevOpenId = useRef(openId);
  useEffect(() => {
    const prev = prevOpenId.current;
    prevOpenId.current = openId;
    if (!openId || openId === prev) return;
    const index = chapters.findIndex((chapter) => chapter.id === openId);
    const heading = index >= 0 ? document.getElementById(chapterAnchors[index]) : null;
    if (!heading) return;
    return glideHeadingToTop(heading);
  }, [openId, chapters]);

  return (
    <section
      id="opus-purum"
      className="py-[max(16vmin,128px)] px-step-4 md:px-step-5 max-w-shell mx-auto"
      aria-labelledby="opus-purum-heading"
    >
      <div className="mb-step-6 space-y-step-5">
        <m.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={reveal()}
          className="text-type-sm uppercase tracking-[0.3em] text-muted-foreground font-light"
        >
          {t('opusPurum.subtitle')}
        </m.p>
        <m.h2
          id="opus-purum-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={reveal(0.1)}
          className="text-type-2 md:text-type-3 font-bold tracking-tighter"
        >
          <a href="#opus-purum" className={anchorLinkClass}>
            {t('opusPurum.h2')}
          </a>
        </m.h2>
        <m.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={reveal(0.15)}
          className="text-type-1 text-muted-foreground font-light italic max-w-text"
        >
          {t('opusPurum.premise')}
        </m.p>
      </div>

      <div className="border-t border-border">
        {chapters.map((chapter, idx) => {
          const isOpen = openId === chapter.id;
          return (
            <m.div
              key={chapter.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={reveal(idx * 0.04)}
              className="border-b border-border"
            >
              {/* Disclosure heading: the anchor link inside the h3 carries the
                  ARIA state (aria-expanded is valid on links). Clicking the
                  title navigates to the anchor and opens the chapter via the
                  hash effect; clicking the rest of the row toggles; Space on
                  the focused link toggles. The toggle glyph is a CSS
                  pseudo-element, never a DOM text node. */}
              <h3
                id={chapterAnchors[idx]}
                onClick={() => toggle(chapter.id)}
                className="flex items-center gap-step-5 py-step-4 text-left group cursor-pointer"
              >
                <span className="text-type-sm font-light tracking-[0.3em] text-muted-foreground tabular-nums w-step-5 shrink-0">
                  {chapter.label}
                </span>
                <span className="sr-only">{' · '}</span>
                <a
                  href={`#${chapterAnchors[idx]}`}
                  aria-expanded={isOpen}
                  aria-controls={`opus-purum-panel-${chapter.id}`}
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => {
                    if (e.key === ' ') {
                      e.preventDefault();
                      toggle(chapter.id);
                    }
                  }}
                  className={`flex-1 text-type-0 font-light tracking-tight ${anchorLinkClass} focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    isOpen ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'
                  }`}
                >
                  {chapter.title}
                </a>
                <span
                  className={`shrink-0 text-muted-foreground transition-transform duration-300 after:content-['+'] ${
                    isOpen ? 'rotate-45' : ''
                  }`}
                  aria-hidden="true"
                />
              </h3>

              {/* Collapse via CSS grid rows, driven only by class names: inline
                  height/opacity styles read as "hidden" to some reader-mode
                  extractors and would drop the chapter text. */}
              <div
                id={`opus-purum-panel-${chapter.id}`}
                role="region"
                aria-labelledby={chapterAnchors[idx]}
                className={`grid transition-[grid-template-rows,opacity] duration-[350ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
                  isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-clip min-h-0">
                  <div className="pb-step-6 max-w-text space-y-step-5 ml-step-6">
                    {chapter.content.map((entry, i) => (
                      <div key={i} className="space-y-step-4">
                        {entry.heading && (
                          <h4 className="text-type-0 md:text-type-1 font-semibold tracking-tight">
                            {entry.heading}
                          </h4>
                        )}
                        <p className="text-muted-foreground font-light">
                          {entry.body}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </m.div>
          );
        })}
      </div>
    </section>
  );
}
