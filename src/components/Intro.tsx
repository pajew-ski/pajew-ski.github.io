import { m } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { KrystalFlower } from './KrystalFlower';

export function Intro() {
  const { t } = useTranslation();

  return (
    <header id="intro" className="relative h-screen w-full flex flex-col items-center overflow-clip px-step-4" aria-label="Introduction">
      {/* Base-2 composition: free space above : below = 1 : √2 places the
          group at the optical centre, just above the middle; the flower
          diameter is 64vmin, the gap to the text three steps down (8vmin). */}
      <div className="grow" />
      <div className="z-10 flex flex-col items-center gap-[8vmin]">

        {/* Text block: compact, subordinate to the logo */}
        <div className="text-center space-y-step-4 max-w-text pointer-events-none select-none">
          <m.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-type-3 md:text-type-4 font-bold tracking-tighter"
          >
            {t('intro.h1')}
          </m.h1>
          <m.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-type-sm font-light tracking-[0.3em] uppercase text-muted-foreground text-balance"
          >
            {t('intro.h2')}
          </m.p>
        </div>

        {/* Krystal Flower: visual centrepiece, reveals on load */}
        <KrystalFlower
          animated
          delay={1.2}
          className="w-[min(64vmin,32rem)] h-[min(64vmin,32rem)] pointer-events-none"
        />
      </div>
      <div className="grow-[1.414]" />
    </header>
  );
}
