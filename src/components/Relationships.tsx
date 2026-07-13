import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { PrincipleCard, type PrincipleItemData } from './Principles';

interface DimensionGroup {
  label: string;
  items: string[];
}

const MANIFESTO_URL =
  'https://theanarchistlibrary.org/library/andie-nordgren-the-short-instructional-manifesto-for-relationship-anarchy';

export function Relationships() {
  const { t } = useTranslation();

  const principles = t('relationships.principles', { returnObjects: true }) as PrincipleItemData[];
  const dimensions = t('relationships.dimensions', { returnObjects: true }) as DimensionGroup[];

  return (
    <section
      id="relationships"
      className="py-32 bg-neutral-100 dark:bg-neutral-900 text-foreground transition-colors duration-500 overflow-hidden"
      aria-labelledby="relationships-heading"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="mb-24 space-y-6">
          <motion.h2
            id="relationships-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold tracking-tighter"
          >
            {t('relationships.h2')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-foreground/80 font-light max-w-3xl"
          >
            {t('relationships.copy')}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {principles.map((item, index) => (
            <PrincipleCard key={index} item={item} index={index} />
          ))}
        </div>

        <div className="mt-32 space-y-12">
          <motion.h3
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold border-b border-foreground/10 pb-4"
          >
            {t('relationships.dimensionsTitle')}
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-foreground/80 font-light max-w-3xl leading-relaxed"
          >
            {t('relationships.dimensionsIntro')}
          </motion.p>

          <div className="space-y-6">
            {dimensions.map((group, index) => (
              <motion.div
                key={group.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex flex-col md:flex-row md:items-baseline gap-3 md:gap-8"
              >
                <span className="w-40 shrink-0 text-xs uppercase tracking-[0.3em] text-muted-foreground font-light">
                  {group.label}
                </span>
                <ul className="flex flex-wrap gap-3">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="border border-foreground/15 rounded-full px-4 py-1.5 text-sm font-light text-foreground/80"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm text-muted-foreground font-light"
          >
            {t('relationships.source')}{' '}
            <a
              href={MANIFESTO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-foreground transition-colors"
            >
              {t('relationships.sourceLinkLabel')}
            </a>
          </motion.p>
        </div>
      </div>
    </section>
  );
}
