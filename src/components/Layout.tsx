import React, { useState } from 'react';
import { Github, Youtube } from 'lucide-react';
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
      <nav className="fixed top-step-5 right-step-5 z-50 flex items-center gap-step-5 mix-blend-difference text-white pointer-events-auto">
        <a
          href="https://github.com/pajew-ski"
          target="_blank"
          rel="noopener noreferrer"
          className="p-step-3 rounded-full hover:bg-secondary transition-colors"
          aria-label="GitHub Profile"
        >
          <Github className="w-step-4 h-step-4" />
        </a>
        <a
          href="https://youtube.com/@m_pajew_ski"
          target="_blank"
          rel="noopener noreferrer"
          className="p-step-3 rounded-full hover:bg-secondary transition-colors"
          aria-label="YouTube Channel"
        >
          <Youtube className="w-step-4 h-step-4" />
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
      {/* pb clears the floating chat toggle (64px plus its offset) so the last
          line never sits under it; the log-nearest step-6 would not */}
      <footer className="w-full pt-step-5 pb-step-7 px-step-5 text-center text-type-sm text-muted-foreground space-y-step-3">
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
            className="bg-background text-foreground rounded-md shadow-xl max-w-text w-full mx-step-4 p-step-5 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowLegal(false)}
              className="absolute top-step-4 right-step-4 text-muted-foreground hover:text-foreground transition-colors text-type-0 cursor-pointer"
              aria-label="Close"
            >
              ✕
            </button>
            <h2 className="text-type-sm font-semibold mb-step-4">{t('legalLink')}</h2>
            <p className="text-type-sm text-muted-foreground">
              {t('siteFooter')}
            </p>
          </div>
        </div>
      )}

      <ChatWidget />
    </div>
  );
}

