import { m } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { anchorLinkClass, enContent, slugify } from '../anchors';
import { PrincipleCard, type PrincipleItemData } from './Principles';
import { reveal, viewportOnce } from '../motion';

interface DimensionGroup {
  label: string;
  desc: string;
}

export function Relationships() {
  const { t } = useTranslation();

  const principles = t('relationships.principles', { returnObjects: true }) as PrincipleItemData[];
  const dimensions = t('relationships.dimensions', { returnObjects: true }) as DimensionGroup[];

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
            id={slugify(enContent.relationships.dimensionsTitle)}
            className="text-3xl font-bold border-b border-foreground/10 pb-phi-sm"
          >
            <a
              href={`#${slugify(enContent.relationships.dimensionsTitle)}`}
              className={anchorLinkClass}
            >
              {t('relationships.dimensionsTitle')}
            </a>
          </m.h3>
          <m.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={reveal()}
            className="text-foreground/80 font-light max-w-3xl"
          >
            {t('relationships.dimensionsIntro')}
          </m.p>

          <ul className="space-y-phi-md max-w-3xl">
            {dimensions.map((group, index) => (
              <m.li
                key={group.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={reveal(index * 0.05)}
                className="text-foreground/80 font-light"
              >
                <strong className="font-bold text-foreground">{group.label}</strong>
                {': '}
                {group.desc}
              </m.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
