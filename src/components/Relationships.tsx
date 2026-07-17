import { m } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { PrincipleCard, type PrincipleItemData } from './Principles';
import { reveal, viewportOnce } from '../motion';

interface DimensionGroup {
  label: string;
  items: string[];
}

export function Relationships() {
  const { t } = useTranslation();

  const principles = t('relationships.principles', { returnObjects: true }) as PrincipleItemData[];
  const dimensions = t('relationships.dimensions', { returnObjects: true }) as DimensionGroup[];

  return (
    <section
      id="relationships"
      className="py-[max(14.6vmin,6.854rem)] bg-neutral-100 dark:bg-neutral-900 text-foreground transition-colors duration-500 overflow-hidden"
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
            <a
              href="#relationships"
              className="underline decoration-1 underline-offset-[0.25em] decoration-transparent transition-colors duration-300 hover:decoration-foreground/30 focus-visible:decoration-foreground/40"
            >
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
            <PrincipleCard key={index} item={item} index={index} headingLevel="h3" />
          ))}
        </div>

        <div className="mt-phi-6xl space-y-phi-3xl">
          <m.h3
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportOnce}
            transition={reveal()}
            className="text-3xl font-bold border-b border-foreground/10 pb-phi-sm"
          >
            {t('relationships.dimensionsTitle')}
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

          <div className="space-y-phi-lg">
            {dimensions.map((group, index) => (
              <m.div
                key={group.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={reveal(index * 0.05)}
                className="flex flex-col md:flex-row md:items-baseline gap-phi-xs md:gap-phi-xl"
              >
                <span className="w-40 shrink-0 text-xs uppercase tracking-[0.3em] text-muted-foreground font-light">
                  {group.label}
                </span>
                <ul className="flex flex-wrap gap-phi-xs">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="border border-foreground/15 rounded-full px-phi-sm py-phi-3xs text-sm font-light text-foreground/80"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </m.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
