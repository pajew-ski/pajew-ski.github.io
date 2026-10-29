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
    <section id="exocortex" className="py-[max(16vmin,128px)] px-step-4 md:px-step-5 max-w-shell mx-auto" aria-labelledby="exocortex-heading">
      <div className="mb-step-6 space-y-step-5">
        <m.h2
          id="exocortex-heading"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={viewportOnce}
          transition={reveal()}
          className="text-type-2 md:text-type-3 font-bold tracking-tighter"
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
          className="text-type-1 text-muted-foreground max-w-text font-light"
        >
          {t('exocortex.copy')}
        </m.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-step-6">
        {features.map((feature, index) => (
          <m.article
            key={feature.key}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={reveal(index * 0.07)}
            className="group"
          >
            <div className="mb-step-5 p-step-4 w-fit rounded-lg bg-secondary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-500">
              <feature.icon className="w-step-5 h-step-5" strokeWidth={1.5} />
            </div>
            <h3
              id={slugify(enContent.exocortex.stack[feature.key].title)}
              className="text-type-1 font-semibold mb-step-4 tracking-tight"
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
