import { m } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
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

  return (
    <section
      id="opus-purum"
      className="py-[max(14.6vmin,6.854rem)] px-phi-sm md:px-phi-xl max-w-7xl mx-auto"
      aria-labelledby="opus-purum-heading"
    >
      <div className="mb-phi-5xl space-y-phi-lg">
        <m.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={reveal()}
          className="text-xs md:text-sm uppercase tracking-[0.3em] text-muted-foreground font-light"
        >
          {t('opusPurum.subtitle')}
        </m.p>
        <m.h2
          id="opus-purum-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={reveal(0.1)}
          className="text-4xl md:text-6xl font-bold tracking-tighter"
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
          className="text-xl md:text-2xl text-foreground/80 font-light italic max-w-3xl"
        >
          {t('opusPurum.premise')}
        </m.p>
      </div>

      <div className="border-t border-foreground/10">
        {chapters.map((chapter, idx) => {
          const isOpen = openId === chapter.id;
          return (
            <m.div
              key={chapter.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={reveal(idx * 0.04)}
              className="border-b border-foreground/10"
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
                className="flex items-center gap-phi-lg py-phi-md text-left group cursor-pointer"
              >
                <span className="text-xs font-light tracking-[0.3em] text-muted-foreground tabular-nums w-phi-lg shrink-0">
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
                  className={`flex-1 text-base md:text-lg font-light tracking-tight ${anchorLinkClass} focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    isOpen ? 'text-foreground' : 'text-foreground/60 group-hover:text-foreground'
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
                  <div className="pb-phi-3xl max-w-3xl space-y-phi-2xl ml-[3.236rem]">
                    {chapter.content.map((entry, i) => (
                      <div key={i} className="space-y-phi-xs">
                        {entry.heading && (
                          <h4 className="text-lg md:text-xl font-semibold tracking-tight">
                            {entry.heading}
                          </h4>
                        )}
                        <p className="text-foreground/75 font-light">
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
