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
    <section className="py-32 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="mb-20">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-bold tracking-tight mb-6"
        >
          {t('exocortex.h2')}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-xl text-muted-foreground max-w-2xl font-light leading-relaxed"
        >
          {t('exocortex.copy')}
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {features.map((feature, index) => (
          <motion.div
            key={feature.key}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
            className="group"
          >
            <div className="mb-6 p-4 w-fit rounded-2xl bg-secondary/50 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-500">
              <feature.icon className="w-8 h-8" strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-semibold mb-4 tracking-tight">{t(`exocortex.stack.${feature.key}.title`)}</h3>
            <p className="text-muted-foreground leading-relaxed font-light">
              {t(`exocortex.stack.${feature.key}.desc`)}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
