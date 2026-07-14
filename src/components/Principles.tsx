import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

export interface PrincipleItemData {
  title: string;
  desc: string;
}

interface PrincipleModuleData {
  title: string;
  list: PrincipleItemData[];
}

export function Principles() {
  const { t } = useTranslation();
  
  const moduleCognition = t('principles.modules.moduleCognition', { returnObjects: true }) as PrincipleModuleData;
  const moduleBeing = t('principles.modules.moduleBeing', { returnObjects: true }) as PrincipleModuleData;
  const moduleDoing = t('principles.modules.moduleDoing', { returnObjects: true }) as PrincipleModuleData;

  return (
    <section id="principles" className="py-[max(14.6vmin,6.854rem)] bg-neutral-100 dark:bg-neutral-900 text-foreground transition-colors duration-500 overflow-hidden" aria-labelledby="principles-heading">
      <div className="max-w-7xl mx-auto px-phi-sm md:px-phi-xl">
        {/* Header Section */}
        <div className="mb-phi-5xl space-y-phi-lg">
          <motion.h2
            id="principles-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold tracking-tighter"
          >
            {t('principles.h2')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-foreground/80 font-light max-w-3xl"
          >
            {t('principles.copy')}
          </motion.p>
        </div>

        <div className="space-y-phi-6xl">
          {/* Module: Erkennen */}
          <div className="space-y-phi-3xl">
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold border-b border-foreground/10 pb-phi-sm"
            >
              {moduleCognition.title}
            </motion.h3>
            <div className="grid grid-cols-1 gap-phi-xl max-w-4xl">
              {moduleCognition.list.map((item, index) => (
                <PrincipleCard
                  key={index}
                  item={item}
                  index={index}
                />
              ))}
            </div>
          </div>

          {/* Module: Sein */}
          <div className="space-y-phi-3xl">
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold border-b border-foreground/10 pb-phi-sm"
            >
              {moduleBeing.title}
            </motion.h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-phi-xl">
              {moduleBeing.list.map((item, index) => (
                <PrincipleCard 
                  key={index} 
                  item={item} 
                  index={index}
                />
              ))}
            </div>
          </div>

          {/* Module: Tun */}
          <div className="space-y-phi-3xl">
             <motion.h3
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold border-b border-foreground/10 pb-phi-sm"
            >
              {moduleDoing.title}
            </motion.h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-phi-xl">
              {moduleDoing.list.map((item, index) => (
                <PrincipleCard 
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

export function PrincipleCard({ item, index }: { item: PrincipleItemData; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="bg-white dark:bg-neutral-800 text-foreground p-phi-xl md:p-phi-2xl flex flex-col justify-center min-h-[240px] border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-600 transition-all duration-300 relative overflow-hidden group cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsHovered(!isHovered)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setIsHovered(!isHovered);
        }
      }}
      tabIndex={0}
      aria-expanded={isHovered}
    >
      <div className="relative z-10">
        <h4 className="text-2xl font-bold mb-phi-sm group-hover:text-primary transition-colors duration-300">
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
          aria-hidden={!isHovered}
        >
          <p className="text-foreground/80 font-light pt-phi-2xs">
            {item.desc}
          </p>
        </motion.div>
      </div>
    </motion.article>
  );
}
