import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Github, Youtube } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';

// The chat pulls in Vue, highlight.js and the n8n design system (~1 MB). Loading
// it lazily keeps that weight off the critical path so first paint and LCP stay
// fast; it is mounted once the browser is idle or on the first user interaction.
const ChatWidget = lazy(() =>
  import('./ChatWidget').then((m) => ({ default: m.ChatWidget })),
);

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { t } = useTranslation();
  const [showLegal, setShowLegal] = useState(false);
  const [chatReady, setChatReady] = useState(false);

  useEffect(() => {
    if (chatReady) return;

    let idleId: number | undefined;
    const ready = () => setChatReady(true);

    // A real interaction always wins: mount the chat immediately.
    const events: Array<keyof WindowEventMap> = ['pointerdown', 'keydown', 'scroll', 'touchstart'];
    events.forEach((e) => window.addEventListener(e, ready, { once: true, passive: true }));

    const w = window as typeof window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    // Otherwise wait for the page to finish loading, then mount on the first
    // idle slot. This keeps the heavy chat chunk out of the first-paint / LCP
    // window entirely instead of racing it.
    const arm = () => {
      if (w.requestIdleCallback) {
        idleId = w.requestIdleCallback(ready, { timeout: 2000 });
      } else {
        idleId = window.setTimeout(ready, 1500);
      }
    };

    let onLoad: (() => void) | undefined;
    if (document.readyState === 'complete') {
      arm();
    } else {
      onLoad = arm;
      window.addEventListener('load', onLoad, { once: true });
    }

    return () => {
      events.forEach((e) => window.removeEventListener(e, ready));
      if (onLoad) window.removeEventListener('load', onLoad);
      if (idleId !== undefined) {
        if (w.cancelIdleCallback) w.cancelIdleCallback(idleId);
        else window.clearTimeout(idleId);
      }
    };
  }, [chatReady]);

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
      <main className="w-full relative">
        {children}
      </main>
      {/* pb clears the floating chat toggle so the last line never sits under it */}
      <footer className="w-full pt-phi-lg pb-phi-5xl px-phi-2xl text-center text-xs text-muted-foreground opacity-60 space-y-phi-2xs">
        <div>
          <LanguageSwitcher />
        </div>
        <div>
          <button
            onClick={() => setShowLegal(true)}
            className="hover:opacity-100 transition-opacity cursor-pointer"
          >
            {t('legalLink')}
          </button>
        </div>
        <p>
          {t('aiContext')}{' '}
          <a href={t('llmsHref')} className="underline underline-offset-2 hover:opacity-100 transition-opacity">
            {t('llmsHref').slice(1)}
          </a>
          {' · '}
          <a href={t('llmsFullHref')} className="underline underline-offset-2 hover:opacity-100 transition-opacity">
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

      {chatReady && (
        <Suspense fallback={null}>
          <ChatWidget />
        </Suspense>
      )}
    </div>
  );
}

