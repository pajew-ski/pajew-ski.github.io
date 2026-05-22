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
  const [openId, setOpenId] = useState<string>(chapters[0]?.id ?? '');

  const toggle = (id: string) => setOpenId((prev) => (prev === id ? '' : id));

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

      <div className="border-t border-foreground/10">
        {chapters.map((chapter, idx) => {
          const isOpen = openId === chapter.id;
          return (
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.04 }}
              className="border-b border-foreground/10"
            >
              <button
                onClick={() => toggle(chapter.id)}
                aria-expanded={isOpen}
                aria-controls={`opus-purum-panel-${chapter.id}`}
                id={`opus-purum-btn-${chapter.id}`}
                className="w-full flex items-center gap-6 py-5 text-left group focus:outline-none"
              >
                <span className="text-xs font-light tracking-[0.3em] text-muted-foreground tabular-nums w-6 shrink-0">
                  {chapter.label}
                </span>
                <span
                  className={`flex-1 text-base md:text-lg font-light tracking-tight transition-colors duration-200 ${
                    isOpen ? 'text-foreground' : 'text-foreground/60 group-hover:text-foreground'
                  }`}
                >
                  {chapter.title}
                </span>
                <span
                  className={`shrink-0 text-muted-foreground transition-transform duration-300 ${
                    isOpen ? 'rotate-45' : ''
                  }`}
                  aria-hidden="true"
                >
                  +
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`opus-purum-panel-${chapter.id}`}
                    role="region"
                    aria-labelledby={`opus-purum-btn-${chapter.id}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="pb-12 max-w-3xl space-y-10 ml-12">
                      {chapter.content.map((entry, i) => (
                        <div key={i} className="space-y-3">
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
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
