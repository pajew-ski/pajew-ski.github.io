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
  
  const moduleA = t('axioms.modules.moduleA', { returnObjects: true }) as AxiomModuleData;
  const moduleB = t('axioms.modules.moduleB', { returnObjects: true }) as AxiomModuleData;

  return (
    <section className="py-32 bg-neutral-100 dark:bg-neutral-900 text-foreground transition-colors duration-500 overflow-hidden">
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
            className="text-xl md:text-2xl text-foreground/80 font-light max-w-3xl"
          >
            {t('axioms.copy')}
          </motion.p>
        </div>

        <div className="space-y-32">
          {/* Module A: Sein */}
          <div className="space-y-12">
            <motion.h3 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold border-b border-foreground/10 pb-4"
            >
              {moduleA.title}
            </motion.h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {moduleA.list.map((item, index) => (
                <AxiomCard 
                  key={index} 
                  item={item} 
                  index={index}
                />
              ))}
            </div>
          </div>

          {/* Module B: Tun */}
          <div className="space-y-12">
             <motion.h3 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold border-b border-foreground/10 pb-4"
            >
              {moduleB.title}
            </motion.h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {moduleB.list.map((item, index) => (
                <AxiomCard 
                  key={index} 
                  item={item} 
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AxiomCard({ item, index }: { item: AxiomItemData; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="bg-white dark:bg-neutral-800 text-foreground p-8 md:p-10 flex flex-col justify-center min-h-[240px] border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-600 transition-all duration-300 relative overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsHovered(!isHovered)}
    >
      <div className="relative z-10">
        <h4 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">
          {item.title}
        </h4>
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ 
            opacity: isHovered ? 1 : 0,
            height: isHovered ? 'auto' : 0
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="overflow-hidden"
        >
          <p className="text-foreground/80 font-light leading-relaxed pt-2">
            {item.desc}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
