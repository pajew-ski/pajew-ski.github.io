import React, { useState } from 'react';
import { Github, Youtube } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ChatWidget } from './ChatWidget';
import { useTranslation } from 'react-i18next';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { t } = useTranslation();
  const [showLegal, setShowLegal] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <nav className="fixed top-phi-lg right-phi-2xl z-50 flex items-center gap-phi-lg mix-blend-difference text-white pointer-events-auto">
        <a
          href="https://github.com/pajew-ski"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          aria-label="GitHub Profile"
        >
          <Github className="w-5 h-5" />
        </a>
        <a
          href="https://youtube.com/@m_pajew_ski"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          aria-label="YouTube Channel"
        >
          <Youtube className="w-5 h-5" />
        </a>
      </nav>
      {/* The article wrapper marks the whole card as the extractable unit for
          reader modes, so their candidate search starts at the h1 instead of
          picking an accordion heading as the article title. */}
      <main className="w-full relative">
        <article>
          {children}
        </article>
      </main>
      {/* pb clears the floating chat toggle so the last line never sits under it */}
      <footer className="w-full pt-phi-lg pb-phi-5xl px-phi-2xl text-center text-xs text-muted-foreground space-y-phi-2xs">
        <div>
          <LanguageSwitcher />
        </div>
        <div>
          <button
            onClick={() => setShowLegal(true)}
            className="hover:text-foreground transition-colors cursor-pointer"
          >
            {t('legalLink')}
          </button>
        </div>
        <p>
          {t('aiContext')}{' '}
          <a href={t('llmsHref')} className="underline underline-offset-2 hover:text-foreground transition-colors">
            {t('llmsHref').slice(1)}
          </a>
          {' · '}
          <a href={t('llmsFullHref')} className="underline underline-offset-2 hover:text-foreground transition-colors">
            {t('llmsFullHref').slice(1)}
          </a>
        </p>
      </footer>

      {showLegal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setShowLegal(false)}
        >
          <div
            className="bg-background text-foreground rounded-lg shadow-xl max-w-lg w-full mx-4 p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowLegal(false)}
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors text-lg cursor-pointer"
              aria-label="Close"
            >
              ✕
            </button>
            <h2 className="text-sm font-semibold mb-3">{t('legalLink')}</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t('siteFooter')}
            </p>
          </div>
        </div>
      )}

      <ChatWidget />
    </div>
  );
}

