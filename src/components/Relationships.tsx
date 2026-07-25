import { m } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { anchorLinkClass, enContent, slugify } from '../anchors';
import { PrincipleCard, type PrincipleItemData } from './Principles';
import { reveal, viewportOnce } from '../motion';

// Building-block anchors carry the subsection slug as a prefix, the same way
// Opus Purum chapters do: "Trust" is both a principle of Being and a building
// block, so the bare slugs would collide.
const blocksAnchor = slugify(enContent.relationships.blocksTitle);

export function Relationships() {
  const { t } = useTranslation();

  const principles = t('relationships.principles', { returnObjects: true }) as PrincipleItemData[];
  const blocks = t('relationships.blocks', { returnObjects: true }) as PrincipleItemData[];

  return (
    <section
      id="relationships"
      className="py-[max(14.6vmin,6.854rem)] bg-neutral-100 dark:bg-neutral-900 text-foreground transition-colors duration-500 overflow-clip"
      aria-labelledby="relationships-heading"
    >
      <div className="max-w-7xl mx-auto px-phi-sm md:px-phi-xl">
        <div className="mb-phi-5xl space-y-phi-lg">
          <m.h2
            id="relationships-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={reveal()}
            className="text-4xl md:text-6xl font-bold tracking-tighter"
          >
            <a href="#relationships" className={anchorLinkClass}>
              {t('relationships.h2')}
            </a>
          </m.h2>
          <m.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={reveal(0.1)}
            className="text-xl md:text-2xl text-foreground/80 font-light max-w-3xl"
          >
            {t('relationships.copy')}
          </m.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-phi-xl">
          {principles.map((item, index) => (
            <PrincipleCard
              key={index}
              item={item}
              index={index}
              anchor={slugify(enContent.relationships.principles[index].title)}
              headingLevel="h3"
            />
          ))}
        </div>

        <div className="mt-phi-6xl space-y-phi-3xl">
          <m.h3
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportOnce}
            transition={reveal()}
            id={blocksAnchor}
            className="text-3xl font-bold border-b border-foreground/10 pb-phi-sm"
          >
            <a href={`#${blocksAnchor}`} className={anchorLinkClass}>
              {t('relationships.blocksTitle')}
            </a>
          </m.h3>
          <m.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={reveal()}
            className="text-foreground/80 font-light max-w-3xl"
          >
            {t('relationships.blocksIntro')}
          </m.p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-phi-xl">
            {blocks.map((item, index) => (
              <PrincipleCard
                key={index}
                item={item}
                index={index}
                anchor={`${blocksAnchor}-${slugify(enContent.relationships.blocks[index].title)}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
