import { m } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useEffect, useId, useState } from 'react';
import { anchorLinkClass, enContent, slugify } from '../anchors';
import { reveal, viewportOnce } from '../motion';

export interface PrincipleItemData {
  title: string;
  desc: string;
}

interface PrincipleModuleData {
  title: string;
  list: PrincipleItemData[];
}

export function Principles() {
  const { t } = useTranslation();

  const moduleBeing = t('principles.modules.moduleBeing', { returnObjects: true }) as PrincipleModuleData;
  const moduleDoing = t('principles.modules.moduleDoing', { returnObjects: true }) as PrincipleModuleData;

  return (
    <section id="principles" className="py-[max(14.6vmin,6.854rem)] bg-neutral-100 dark:bg-neutral-900 text-foreground transition-colors duration-500 overflow-clip" aria-labelledby="principles-heading">
      <div className="max-w-7xl mx-auto px-phi-sm md:px-phi-xl">
        {/* Header Section */}
        <div className="mb-phi-5xl space-y-phi-lg">
          <m.h2
            id="principles-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={reveal()}
            className="text-4xl md:text-6xl font-bold tracking-tighter"
          >
            <a href="#principles" className={anchorLinkClass}>
              {t('principles.h2')}
            </a>
          </m.h2>
          <m.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={reveal(0.1)}
            className="text-xl md:text-2xl text-foreground/80 font-light max-w-3xl"
          >
            {t('principles.copy')}
          </m.p>
        </div>

        <div className="space-y-phi-6xl">
          {/* Module: Sein */}
          <div className="space-y-phi-3xl">
            <m.h3
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={viewportOnce}
              transition={reveal()}
              id={slugify(enContent.principles.modules.moduleBeing.title)}
              className="text-3xl font-bold border-b border-foreground/10 pb-phi-sm"
            >
              <a
                href={`#${slugify(enContent.principles.modules.moduleBeing.title)}`}
                className={anchorLinkClass}
              >
                {moduleBeing.title}
              </a>
            </m.h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-phi-xl">
              {moduleBeing.list.map((item, index) => (
                <PrincipleCard
                  key={index}
                  item={item}
                  index={index}
                  anchor={slugify(enContent.principles.modules.moduleBeing.list[index].title)}
                />
              ))}
            </div>
          </div>

          {/* Module: Tun */}
          <div className="space-y-phi-3xl">
             <m.h3
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={viewportOnce}
              transition={reveal()}
              id={slugify(enContent.principles.modules.moduleDoing.title)}
              className="text-3xl font-bold border-b border-foreground/10 pb-phi-sm"
            >
              <a
                href={`#${slugify(enContent.principles.modules.moduleDoing.title)}`}
                className={anchorLinkClass}
              >
                {moduleDoing.title}
              </a>
            </m.h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-phi-xl">
              {moduleDoing.list.map((item, index) => (
                <PrincipleCard
                  key={index}
                  item={item}
                  index={index}
                  anchor={slugify(enContent.principles.modules.moduleDoing.list[index].title)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface PrincipleCardProps {
  item: PrincipleItemData;
  index: number;
  // Language-independent anchor slug, derived from the English title.
  anchor: string;
  // Heading level follows the surrounding outline: h4 under a module h3
  // (Principles), h3 directly under the section h2 (Relationships).
  headingLevel?: 'h3' | 'h4';
}

export function PrincipleCard({ item, index, anchor, headingLevel: Heading = 'h4' }: PrincipleCardProps) {
  // Deep links open the card's description; reading the hash in the
  // initializer keeps the first paint layout-stable for the fragment scroll.
  const [isHovered, setIsHovered] = useState(
    () => window.location.hash === `#${anchor}`
  );
  const descId = useId();

  useEffect(() => {
    const openFromHash = () => {
      if (window.location.hash === `#${anchor}`) setIsHovered(true);
    };
    window.addEventListener('hashchange', openFromHash);
    return () => window.removeEventListener('hashchange', openFromHash);
  }, [anchor]);

  return (
    <m.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={reveal(index * 0.05)}
      className="bg-white dark:bg-neutral-800 text-foreground p-phi-xl md:p-phi-2xl flex flex-col justify-center min-h-[240px] border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-600 transition-[border-color,box-shadow] duration-300 relative group cursor-pointer"
      onPointerEnter={(e) => e.pointerType === 'mouse' && setIsHovered(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setIsHovered(false)}
      onClick={() => setIsHovered(!isHovered)}
    >
      {/* Anchor link doubling as the disclosure control (aria-expanded is
          valid on links): Enter navigates to the anchor and the hash effect
          opens the card, Space toggles, clicking the rest of the card
          toggles. aria-expanded on the article itself would be invalid.
          No wrapper div: a bare article is exempt from Readability's
          conditional cleaning, which can delete short link-and-text divs. */}
      <Heading id={anchor} className="text-2xl font-bold mb-phi-sm group-hover:text-primary transition-colors duration-300">
          <a
            href={`#${anchor}`}
            aria-expanded={isHovered}
            aria-controls={descId}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === ' ') {
                e.preventDefault();
                setIsHovered(!isHovered);
              }
            }}
            className={`${anchorLinkClass} focus:outline-none focus-visible:ring-2 focus-visible:ring-primary`}
          >
            {item.title}
          </a>
        </Heading>
      {/* Class-driven collapse; inline height/opacity styles would hide the
          description from reader-mode extractors. */}
      <div
        id={descId}
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
          isHovered ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-clip min-h-0">
          <p className="text-foreground/80 font-light pt-phi-2xs">
            {item.desc}
          </p>
        </div>
      </div>
    </m.article>
  );
}
