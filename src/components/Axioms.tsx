import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

interface AxiomItemData {
  title: string;
  desc: string;
}

interface AxiomModuleData {
  title: string;
  list: AxiomItemData[];
}

export function Axioms() {
  const { t } = useTranslation();

  // Cast the translation results to our interfaces
  const moduleA = t('axioms.modules.moduleA', { returnObjects: true }) as AxiomModuleData;
  const moduleB = t('axioms.modules.moduleB', { returnObjects: true }) as AxiomModuleData;

  return (
    <section className="py-32 bg-foreground text-background transition-colors duration-500 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header Section */}
        <div className="mb-24 space-y-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold tracking-tighter"
          >
            {t('axioms.h2')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-background/80 font-light max-w-3xl"
          >
            {t('axioms.copy')}
          </motion.p>
        </div>

        {/* Bivalent Grid System */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">

          {/* Module A: Sein (Left Column) */}
          <div className="space-y-12">
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold border-b border-background/20 pb-4"
            >
              {moduleA.title}
            </motion.h3>
            <div className="space-y-1">
              {moduleA.list.map((item, index) => (
                <AxiomItem
                  key={index}
                  item={item}
                  index={index}
                  fontClass="font-sans"
                />
              ))}
            </div>
          </div>

          {/* Module B: Tun (Right Column) */}
          <div className="space-y-12">
             <motion.h3
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-mono border-b border-background/20 pb-4"
            >
              {moduleB.title}
            </motion.h3>
            <div className="space-y-1">
              {moduleB.list.map((item, index) => (
                <AxiomItem
                  key={index}
                  item={item}
                  index={index}
                  fontClass="font-mono"
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

function AxiomItem({ item, index, fontClass }: { item: AxiomItemData; index: number; fontClass: string }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="group cursor-pointer py-4 border-b border-background/5"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsHovered(!isHovered)}
    >
      <div className="flex items-baseline gap-4">
        <span className={`text-sm opacity-30 font-mono`}>
          {(index + 1).toString().padStart(2, '0')}
        </span>
        <div className="flex-1">
          <h4 className={`text-xl md:text-2xl font-medium transition-colors duration-300 ${fontClass} ${isHovered ? 'text-primary' : 'text-background'}`}>
            {item.title}
          </h4>
          <motion.div
            initial={false}
            animate={{
              height: isHovered ? 'auto' : 0,
              opacity: isHovered ? 1 : 0,
              marginTop: isHovered ? 8 : 0
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <p className="text-background/70 font-light leading-relaxed">
              {item.desc}
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
