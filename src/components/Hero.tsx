import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { KrystalFlower } from './KrystalFlower';

export function Hero() {
  const { t } = useTranslation();

  return (
    <header className="relative h-screen w-full flex flex-col justify-center items-center overflow-hidden px-6" aria-label="Introduction">
      <div className="z-10 flex flex-col items-center gap-10 md:gap-14">

        {/* Text block — compact, subordinate to the logo */}
        <div className="text-center space-y-3 md:space-y-4 max-w-3xl text-foreground pointer-events-none select-none">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl font-bold tracking-tighter"
          >
            {t('hero.h1')}
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-[11px] md:text-xs font-light tracking-[0.28em] uppercase opacity-60"
          >
            {t('hero.h2')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-xs md:text-sm font-light max-w-md mx-auto leading-relaxed opacity-50"
          >
            {t('hero.lead')}
          </motion.p>
        </div>

        {/* Krystal Flower — visual centrepiece, draws on load */}
        <KrystalFlower
          animated
          delay={1.2}
          className="w-44 h-44 md:w-64 md:h-64 lg:w-72 lg:h-72 pointer-events-none"
        />
      </div>
    </header>
  );
}
