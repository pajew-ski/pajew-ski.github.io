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
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M19.24 12.99a3.394 3.394 0 0 0-.09-.71c.05-.02.1-.04.14-.07a1.76 1.76 0 0 0 .55-2.37 1.747 1.747 0 0 0-1.51-.87c-.07 0-.14.01-.21.02a1.764 1.764 0 0 0-1.22-2.14 1.754 1.754 0 0 0-2.05 1.05A3.386 3.386 0 0 0 12 7.13a3.386 3.386 0 0 0-2.85 1.77 1.754 1.754 0 0 0-2.05-1.05 1.764 1.764 0 0 0-1.22 2.14c-.07-.01-.14-.02-.21-.02-.65 0-1.26.35-1.59.92a1.76 1.76 0 0 0 .64 2.4c.04.02.09.05.13.07-.06.23-.09.47-.09.71a3.41 3.41 0 0 0 1.44 2.79 1.756 1.756 0 0 0 2.38 2.37A3.368 3.368 0 0 0 12 18.87a3.368 3.368 0 0 0 2.62-1.72 1.756 1.756 0 0 0 2.38-2.37 3.41 3.41 0 0 0 1.24-1.79zm-7.24 3.2a1.714 1.714 0 0 1-1.71-1.71c0-.94.77-1.71 1.71-1.71s1.71.77 1.71 1.71-.77 1.71-1.71 1.71z" />
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

