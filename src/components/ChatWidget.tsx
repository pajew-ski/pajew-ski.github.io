import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// The chat bundle is heavy (Vue runtime); parsing it competes with the intro
// animation and, in lab metrics, with the interactivity window. Loading on
// the first user signal keeps the widget ready before anyone reaches it; the
// timer after window load covers visitors who never touch the page.
const INTERACTION_EVENTS = ['pointerdown', 'pointermove', 'touchstart', 'wheel', 'scroll', 'keydown'] as const;
const FALLBACK_DELAY_MS = 6000;

function onFirstInteraction(callback: () => void): () => void {
  let done = false;
  let timerId: number | undefined;
  const fire = () => {
    if (done) return;
    done = true;
    cleanup();
    callback();
  };
  const startFallbackTimer = () => {
    timerId = window.setTimeout(fire, FALLBACK_DELAY_MS);
  };
  function cleanup() {
    for (const event of INTERACTION_EVENTS) {
      window.removeEventListener(event, fire);
    }
    window.removeEventListener('load', startFallbackTimer);
    if (timerId !== undefined) window.clearTimeout(timerId);
  }
  for (const event of INTERACTION_EVENTS) {
    window.addEventListener(event, fire, { once: true, passive: true });
  }
  if (document.readyState === 'complete') {
    startFallbackTimer();
  } else {
    window.addEventListener('load', startFallbackTimer, { once: true });
  }
  return cleanup;
}

export function ChatWidget() {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      const { createChat } = await import('../chat');
      if (cancelled) return;

      // Clear any existing chat instance
      const target = document.getElementById('n8n-chat');
      if (target) {
        target.innerHTML = '';
      }

      createChat({
        webhookUrl: 'https://n8n.pajewski.net/webhook/580e7531-abf2-4933-a1c7-ce2c5155c746/chat',
        target: '#n8n-chat',
        mode: 'window',
        // We force 'en' as the language key because n8n chat currently only supports 'en'
        // as a configuration key for i18n overrides, but we inject our localized strings.
        defaultLanguage: 'en',
        i18n: {
          en: {
            title: t('chat.title', 'Assistant'),
            subtitle: t('chat.subtitle', 'Ask me anything'),
            inputPlaceholder: t('chat.placeholder', 'Type your message...'),
            getStarted: t('chat.getStarted', 'New Conversation'),
            footer: t('chat.footer', ''),
            closeButtonTooltip: t('chat.closeButtonTooltip', 'Close chat'),
          },
        },
        showWelcomeScreen: true,
        metadata: {},
        initialMessages: [
          t('chat.initialMessage', 'Hello! How can I help you today?')
        ],
      });
    };

    const cancelPending = onFirstInteraction(() => {
      void init();
    });

    return () => {
      cancelled = true;
      cancelPending();
    };
  }, [t, i18n.language]);

  return <div id="n8n-chat" />;
}
