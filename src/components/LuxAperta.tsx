import { m } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { anchorLinkClass, enContent, slugify } from '../anchors';
import { reveal, viewportOnce } from '../motion';

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
      id="lux-aperta"
      className="py-[max(14.6vmin,6.854rem)] px-phi-sm md:px-phi-xl max-w-7xl mx-auto"
      aria-labelledby="lux-aperta-heading"
    >
      <div className="mb-phi-5xl space-y-phi-lg">
        <m.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={reveal()}
          className="text-xs md:text-sm uppercase tracking-[0.3em] text-muted-foreground font-light"
        >
          {t('luxAperta.subtitle')}
        </m.p>
        <m.h2
          id="lux-aperta-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={reveal(0.1)}
          className="text-4xl md:text-6xl font-bold tracking-tighter"
        >
          <a href="#lux-aperta" className={anchorLinkClass}>
            {t('luxAperta.h2')}
          </a>
        </m.h2>
        <m.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={reveal(0.15)}
          className="text-xl md:text-2xl text-foreground/80 font-light italic max-w-3xl"
        >
          {t('luxAperta.lead')}
        </m.p>
      </div>

      <div className="max-w-3xl space-y-phi-lg mb-phi-5xl">
        {paragraphs.map((paragraph, index) => (
          <m.p
            key={index}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={reveal(index * 0.05)}
            className={
              index === paragraphs.length - 1
                ? 'text-foreground'
                : 'text-foreground/75 font-light'
            }
          >
            {paragraph}
          </m.p>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-phi-xl">
        {formats.map((format, index) => (
          <m.article
            key={format.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={reveal(index * 0.1)}
            className="border border-foreground/10 p-phi-xl md:p-phi-2xl space-y-phi-lg"
          >
            {/* header, not div: Readability conditionally deletes small
                link-and-text divs, and the title is a link now */}
            <header className="space-y-phi-2xs">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-light">
                {format.tagline}
              </p>
              <h3
                id={slugify(enContent.luxAperta.formats[index].title)}
                className="text-2xl md:text-3xl font-semibold tracking-tight"
              >
                <a
                  href={`#${slugify(enContent.luxAperta.formats[index].title)}`}
                  className={anchorLinkClass}
                >
                  {format.title}
                </a>
              </h3>
            </header>
            {format.paragraphs.map((paragraph, i) => (
              <p key={i} className="text-foreground/75 font-light">
                {paragraph}
              </p>
            ))}
            {format.facts && format.facts.length > 0 && (
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-phi-xl gap-y-phi-sm pt-phi-lg border-t border-foreground/10">
                {format.facts.map((fact) => (
                  <div key={fact.label}>
                    <dt className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-light mb-phi-3xs">
                      {fact.label}
                    </dt>
                    <dd className="text-sm font-light text-foreground/80">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </m.article>
        ))}
      </div>
    </section>
  );
}
