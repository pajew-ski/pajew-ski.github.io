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
      viewBox="0 0 1000 1000"
      fill="none"
      stroke="currentColor"
      strokeWidth="60"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M869.8,761.1c34.7,4.8,69,9.6,74.5,44.5c14.5,92.9-165.6,58.3-206.8,38.2c-64.5-31.7-103.7-104-86.9-175.4c6.4-27.6,41.4-99.1,74.3-166.4c30.8-63.1,59.8-122.4,62-138.5c4.5-34.3-13.7-37.1-25.2-37.7c-14.7-0.7-26.3,6.4-40.7,28.1c-9.1,13.7-82.3,158.8-131.1,255.8c-22.2,43.9-39.3,78-43.4,85.5c-23,43.5-52,54-81.1,52.4c-42.5-2.2-61.9-25-55.8-65.9c1.7-11,22.4-61.7,44.8-116.4c26.4-64.8,55.3-135.4,57.9-153.4c3-20.5-1.1-42.3-21.4-52.7c-20.4-10.5-44.4,5.5-51.6,17.6c-4.7,8-37.4,91.1-71.9,178.8c-38.1,96.7-78.3,198.8-85.7,212.3c-24.5,44.8-50.4,59-89.3,60.8c-92,4.4-160.3-71.4-130.2-164.2c2.5-7.7,7.5-24.7,14.5-47.9C107,514.8,172.6,294.8,209,229.8c30.2-53.7,114-94.3,172.2-69.2c19,8.3,42.8,19.6,60.7,28.2c10.4,5,18.9,9,23.3,11.1c24.9,11.1,51.4-13.7,65.6-27.1c2-1.9,3.8-3.5,5.3-4.8c1.4-1.2,2.8-2.5,4.2-3.7c10.6-9.3,21.1-18.5,34-24c14.6-6.3,37.5-8.9,55.3-6.3c17.8,2.6,28.4,9.4,35,14.7c11,8.7,18.4,15.9,27.8,24.9l5.8,5.5c17.1,16.3,29.7,8.5,38.9,3l2.4-1.4l0.5-0.3c15.9-9.3,28.7-16.7,76-15.9c49.1,0.8,105.6,18.5,117.4,102.2c6.3,45.2-29.4,125-66.6,207.9c-39.4,87.8-80.2,179-74.3,236.2C796.6,751,833.4,756.1,869.8,761.1L869.8,761.1z"/>
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

