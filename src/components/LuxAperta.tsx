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
      className="py-[max(16vmin,128px)] px-step-4 md:px-step-5 max-w-shell mx-auto"
      aria-labelledby="lux-aperta-heading"
    >
      <div className="mb-step-6 space-y-step-5">
        <m.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={reveal()}
          className="text-type-sm uppercase tracking-[0.3em] text-muted-foreground font-light"
        >
          {t('luxAperta.subtitle')}
        </m.p>
        <m.h2
          id="lux-aperta-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={reveal(0.1)}
          className="text-type-2 md:text-type-3 font-bold tracking-tighter"
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
          className="text-type-1 text-muted-foreground font-light italic max-w-text"
        >
          {t('luxAperta.lead')}
        </m.p>
      </div>

      <div className="max-w-text space-y-step-5 mb-step-6">
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
                : 'text-muted-foreground font-light'
            }
          >
            {paragraph}
          </m.p>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-step-5">
        {formats.map((format, index) => (
          <m.article
            key={format.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={reveal(index * 0.1)}
            className="border border-border p-step-5 space-y-step-5"
          >
            {/* header, not div: Readability conditionally deletes small
                link-and-text divs, and the title is a link now */}
            <header className="space-y-step-3">
              <p className="text-type-sm uppercase tracking-[0.3em] text-muted-foreground font-light">
                {format.tagline}
              </p>
              <h3
                id={slugify(enContent.luxAperta.formats[index].title)}
                className="text-type-1 font-semibold tracking-tight"
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
              <p key={i} className="text-muted-foreground font-light">
                {paragraph}
              </p>
            ))}
            {format.facts && format.facts.length > 0 && (
              <dl className="grid grid-cols-[repeat(auto-fit,minmax(min(256px,100%),1fr))] gap-x-step-5 gap-y-step-4 pt-step-5 border-t border-border">
                {format.facts.map((fact) => (
                  <div key={fact.label}>
                    <dt className="text-type-sm uppercase tracking-[0.3em] text-muted-foreground font-light mb-step-3">
                      {fact.label}
                    </dt>
                    <dd className="text-type-sm font-light text-muted-foreground">{fact.value}</dd>
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
