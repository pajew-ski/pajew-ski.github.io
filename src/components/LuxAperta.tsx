import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface FormatFact {
  label: string;
  value: string;
}

interface FormatData {
  id: string;
  title: string;
  tagline: string;
  paragraphs: string[];
  facts?: FormatFact[];
}

export function LuxAperta() {
  const { t } = useTranslation();

  const paragraphs = t('luxAperta.paragraphs', { returnObjects: true }) as string[];
  const formats = t('luxAperta.formats', { returnObjects: true }) as FormatData[];

  return (
    <section
      className="py-32 px-4 md:px-8 max-w-7xl mx-auto"
      aria-labelledby="lux-aperta-heading"
    >
      <div className="mb-16 space-y-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs md:text-sm uppercase tracking-[0.35em] text-muted-foreground font-light"
        >
          {t('luxAperta.subtitle')}
        </motion.p>
        <motion.h2
          id="lux-aperta-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-bold tracking-tighter"
        >
          {t('luxAperta.h2')}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-xl md:text-2xl text-foreground/80 font-light italic max-w-2xl leading-relaxed"
        >
          {t('luxAperta.lead')}
        </motion.p>
      </div>

      <div className="max-w-3xl space-y-6 mb-24">
        {paragraphs.map((paragraph, index) => (
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className={
              index === paragraphs.length - 1
                ? 'text-foreground leading-relaxed'
                : 'text-foreground/75 font-light leading-relaxed'
            }
          >
            {paragraph}
          </motion.p>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {formats.map((format, index) => (
          <motion.article
            key={format.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            className="border border-foreground/10 p-8 md:p-10 space-y-6"
          >
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-light">
                {format.tagline}
              </p>
              <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">
                {format.title}
              </h3>
            </div>
            {format.paragraphs.map((paragraph, i) => (
              <p key={i} className="text-foreground/75 font-light leading-relaxed">
                {paragraph}
              </p>
            ))}
            {format.facts && format.facts.length > 0 && (
              <dl className="grid grid-cols-2 gap-x-8 gap-y-4 pt-6 border-t border-foreground/10">
                {format.facts.map((fact) => (
                  <div key={fact.label}>
                    <dt className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-light mb-1">
                      {fact.label}
                    </dt>
                    <dd className="text-sm font-light text-foreground/80">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </motion.article>
        ))}
      </div>
    </section>
  );
}
