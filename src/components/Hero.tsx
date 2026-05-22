import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ParticleNetwork } from './ParticleNetwork';
import { KrystalFlower } from './KrystalFlower';

export function Hero() {
  const { t } = useTranslation();

  return (
    <header className="relative h-screen w-full flex flex-col justify-center items-center overflow-hidden px-4" aria-label="Introduction">
      <ParticleNetwork />
      <div className="z-10 text-center space-y-8 max-w-4xl mix-blend-difference text-white pointer-events-none select-none">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-7xl md:text-9xl font-bold tracking-tighter"
        >
          {t('hero.h1')}
        </motion.h1>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-xl md:text-2xl font-light tracking-wide uppercase opacity-80"
        >
          {t('hero.h2')}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed opacity-70"
        >
          {t('hero.lead')}
        </motion.p>
      </div>

      {/* Krystal Flower logo — draws from center on page load */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <KrystalFlower size={112} animated delay={1.5} />
      </div>
    </header>
  );
}
