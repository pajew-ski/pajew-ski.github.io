import { m } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Brain, Cpu, ShieldCheck } from 'lucide-react';
import { anchorLinkClass, enContent, slugify } from '../anchors';
import { reveal, viewportOnce } from '../motion';

export function Exocortex() {
  const { t } = useTranslation();

  const features = [
    { key: 'orchestration', icon: Cpu },
    { key: 'memory', icon: Brain },
    { key: 'operations', icon: ShieldCheck },
  ] as const;

  return (
    <section id="exocortex" className="py-[max(14.6vmin,6.854rem)] px-phi-sm md:px-phi-xl max-w-7xl mx-auto" aria-labelledby="exocortex-heading">
      <div className="mb-phi-5xl space-y-phi-lg">
        <m.h2
          id="exocortex-heading"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={viewportOnce}
          transition={reveal()}
          className="text-4xl md:text-6xl font-bold tracking-tighter"
        >
          <a href="#exocortex" className={anchorLinkClass}>
            {t('exocortex.h2')}
          </a>
        </m.h2>
        <m.p
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={viewportOnce}
          transition={reveal(0.1)}
          className="text-xl md:text-2xl text-muted-foreground max-w-3xl font-light"
        >
          {t('exocortex.copy')}
        </m.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-phi-3xl">
        {features.map((feature, index) => (
          <m.article
            key={feature.key}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={reveal(index * 0.07)}
            className="group"
          >
            <div className="mb-phi-lg p-phi-sm w-fit rounded-2xl bg-secondary/50 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-500">
              <feature.icon className="w-phi-xl h-phi-xl" strokeWidth={1.5} />
            </div>
            <h3
              id={slugify(enContent.exocortex.stack[feature.key].title)}
              className="text-2xl font-semibold mb-phi-sm tracking-tight"
            >
              <a
                href={`#${slugify(enContent.exocortex.stack[feature.key].title)}`}
                className={anchorLinkClass}
              >
                {t(`exocortex.stack.${feature.key}.title`)}
              </a>
            </h3>
            <p className="text-muted-foreground font-light">
              {t(`exocortex.stack.${feature.key}.desc`)}
            </p>
          </m.article>
        ))}
      </div>
    </section>
  );
}
