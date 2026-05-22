import React, { useState } from 'react';
import { Github, Youtube } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ChatWidget } from './ChatWidget';
import { useTranslation } from 'react-i18next';

function MeetupIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M12 3c3.5 0 7.5 2.5 8.5 6.5.5 2 0 4-1 5.5.5 1.5.5 3-1 4.5s-3.5 2.5-5.5 2.5-4-.5-5.5-2c-1 .5-2.5 0-3.5-1.5S3.5 16 3.5 14.5c-1-1-1.5-3-.5-5C4 7 7.5 3 12 3z" />
      <path d="M8.5 15v-3.5a1.5 1.5 0 0 1 3 0 1.5 1.5 0 0 1 3 0V15" />
    </svg>
  );
}

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { t } = useTranslation();
  const [showLegal, setShowLegal] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <nav className="fixed top-6 right-8 z-50 flex items-center gap-6 mix-blend-difference text-white pointer-events-auto">
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
        <a
          href="https://www.meetup.com/lux-aperta-bavaria/"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          aria-label="Meetup Group"
        >
          <MeetupIcon className="w-5 h-5" />
        </a>
        <LanguageSwitcher />
        <ThemeToggle />
      </nav>
      <main className="w-full relative">
        {children}
      </main>
      <footer className="w-full py-6 px-8 text-center text-xs text-muted-foreground opacity-60">
        <button
          onClick={() => setShowLegal(true)}
          className="hover:opacity-100 transition-opacity cursor-pointer"
        >
          {t('legalLink')}
        </button>
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

