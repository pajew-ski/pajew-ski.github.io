import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export function Axioms() {
  const { t } = useTranslation();
  const axioms = t('axioms.list', { returnObjects: true }) as Array<{ title: string; desc: string }>;

  return (
    <section className="py-32 bg-foreground text-background transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-bold tracking-tighter mb-16 text-center"
        >
          {t('axioms.h2')}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {axioms.map((axiom, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="relative p-8 border border-background/20 hover:border-background/60 transition-colors duration-300 group"
            >
              <div className="text-6xl font-mono opacity-10 mb-6 font-bold group-hover:opacity-20 transition-opacity">
                0{index + 1}
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight">{axiom.title}</h3>
              <p className="text-background/80 font-light leading-relaxed">
                {axiom.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
