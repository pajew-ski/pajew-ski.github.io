import { useEffect } from 'react';
import { createChat } from '@n8n/chat';
import { useTranslation } from 'react-i18next';

export function ChatWidget() {
  const { t, i18n } = useTranslation();

  useEffect(() => {
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
  }, [t, i18n.language]);

  return <div id="n8n-chat" />;
}
