import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

interface ChapterEntry {
  heading: string;
  body: string;
}

interface Chapter {
  id: string;
  label: string;
  title: string;
  content: ChapterEntry[];
}

export function OpusPurum() {
  const { t } = useTranslation();
  const chapters = t('opusPurum.chapters', { returnObjects: true }) as Chapter[];
  const [activeId, setActiveId] = useState<string>(chapters[0]?.id ?? '');
  const activeChapter = chapters.find((c) => c.id === activeId) ?? chapters[0];

  return (
    <section
      className="py-32 px-4 md:px-8 max-w-7xl mx-auto"
      aria-labelledby="opus-purum-heading"
    >
      <div className="mb-16 space-y-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs md:text-sm uppercase tracking-[0.35em] text-muted-foreground font-light"
        >
          {t('opusPurum.subtitle')}
        </motion.p>
        <motion.h2
          id="opus-purum-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-bold tracking-tighter"
        >
          {t('opusPurum.h2')}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-xl md:text-2xl text-foreground/80 font-light italic max-w-2xl leading-relaxed"
        >
          {t('opusPurum.premise')}
        </motion.p>
      </div>

      {/* Chapter Navigation */}
      <div
        className="border-y border-foreground/10 mb-16 overflow-x-auto"
        role="tablist"
        aria-label={t('opusPurum.h2')}
      >
        <div className="flex min-w-max">
          {chapters.map((chapter) => {
            const isActive = activeId === chapter.id;
            return (
              <button
                key={chapter.id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`opus-purum-panel-${chapter.id}`}
                id={`opus-purum-tab-${chapter.id}`}
                onClick={() => setActiveId(chapter.id)}
                className={`px-5 py-4 text-[10px] md:text-xs font-light tracking-[0.25em] uppercase whitespace-nowrap border-b-2 -mb-px transition-colors duration-200 focus:outline-none focus:text-foreground ${
                  isActive
                    ? 'border-foreground text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {chapter.label} · {chapter.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active chapter content */}
      <AnimatePresence mode="wait">
        <motion.article
          key={activeChapter.id}
          id={`opus-purum-panel-${activeChapter.id}`}
          role="tabpanel"
          aria-labelledby={`opus-purum-tab-${activeChapter.id}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="max-w-3xl"
        >
          <div className="flex items-baseline gap-5 mb-12 border-b border-foreground/10 pb-4">
            <span className="text-sm font-light tracking-[0.3em] text-muted-foreground">
              {activeChapter.label}
            </span>
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight">
              {activeChapter.title}
            </h3>
          </div>

          <div className="space-y-10">
            {activeChapter.content.map((entry, idx) => (
              <div key={idx} className="space-y-3">
                {entry.heading && (
                  <h4 className="text-lg md:text-xl font-semibold tracking-tight">
                    {entry.heading}
                  </h4>
                )}
                <p className="text-foreground/75 font-light leading-relaxed">
                  {entry.body}
                </p>
              </div>
            ))}
          </div>
        </motion.article>
      </AnimatePresence>
    </section>
  );
}
