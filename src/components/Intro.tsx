import { m } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { KrystalFlower } from './KrystalFlower';

export function Intro() {
  const { t } = useTranslation();

  return (
    <header id="intro" className="relative h-screen w-full flex flex-col items-center overflow-clip px-6" aria-label="Introduction">
      {/* Golden-section composition: free space above : below = 1 : φ places the
          group at the optical centre; flower diameter is 100vmin/φ, the gap to
          the text is one φ-ladder step further down (61.8/φ⁴ ≈ 9vmin). */}
      <div className="grow" />
      <div className="z-10 flex flex-col items-center gap-[9vmin]">

        {/* Text block: compact, subordinate to the logo */}
        <div className="text-center space-y-phi-xs md:space-y-phi-sm max-w-3xl text-foreground pointer-events-none select-none">
          <m.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl font-bold tracking-tighter"
          >
            {t('intro.h1')}
          </m.h1>
          <m.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[0.694rem] md:text-xs font-light tracking-[0.3em] uppercase opacity-60"
          >
            {t('intro.h2')}
          </m.p>
        </div>

        {/* Krystal Flower: visual centrepiece, reveals on load */}
        <KrystalFlower
          animated
          delay={1.2}
          className="w-[min(61.8vmin,32rem)] h-[min(61.8vmin,32rem)] pointer-events-none"
        />
      </div>
      <div className="grow-[1.618]" />
    </header>
  );
}
