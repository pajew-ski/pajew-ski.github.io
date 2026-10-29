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
      className="py-[max(16vmin,128px)] bg-secondary text-foreground transition-colors duration-500 overflow-clip"
      aria-labelledby="relationships-heading"
    >
      <div className="max-w-shell mx-auto px-step-4 md:px-step-5">
        <div className="mb-step-6 space-y-step-5">
          <m.h2
            id="relationships-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={reveal()}
            className="text-type-2 md:text-type-3 font-bold tracking-tighter"
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
            className="text-type-1 text-muted-foreground font-light max-w-text"
          >
            {t('relationships.copy')}
          </m.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-step-5">
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

        <div className="mt-step-7 space-y-step-6">
          <m.h3
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportOnce}
            transition={reveal()}
            id={blocksAnchor}
            className="text-type-1 font-bold border-b border-border pb-step-4"
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
            className="text-muted-foreground font-light max-w-text"
          >
            {t('relationships.blocksIntro')}
          </m.p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-step-5">
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
