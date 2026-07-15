import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Brain, Cpu, ShieldCheck } from 'lucide-react';

export function Exocortex() {
  const { t } = useTranslation();

  const features = [
    { key: 'orchestration', icon: Cpu },
    { key: 'memory', icon: Brain },
    { key: 'operations', icon: ShieldCheck },
  ];

  return (
    <section id="exocortex" className="py-[max(14.6vmin,6.854rem)] px-phi-sm md:px-phi-xl max-w-7xl mx-auto" aria-labelledby="exocortex-heading">
      <div className="mb-phi-5xl space-y-phi-lg">
        <motion.h2
          id="exocortex-heading"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-bold tracking-tighter"
        >
          <a
            href="#exocortex"
            className="underline decoration-1 underline-offset-[0.25em] decoration-transparent transition-colors duration-300 hover:decoration-foreground/30 focus-visible:decoration-foreground/40"
          >
            {t('exocortex.h2')}
          </a>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-xl md:text-2xl text-muted-foreground max-w-3xl font-light"
        >
          {t('exocortex.copy')}
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-phi-3xl">
        {features.map((feature, index) => (
          <motion.article
            key={feature.key}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
            className="group"
          >
            <div className="mb-phi-lg p-phi-sm w-fit rounded-2xl bg-secondary/50 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-500">
              <feature.icon className="w-phi-xl h-phi-xl" strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-semibold mb-phi-sm tracking-tight">{t(`exocortex.stack.${feature.key}.title`)}</h3>
            <p className="text-muted-foreground font-light">
              {t(`exocortex.stack.${feature.key}.desc`)}
            </p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
