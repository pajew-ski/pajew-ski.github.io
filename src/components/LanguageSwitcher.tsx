import { useTranslation } from 'react-i18next';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const isGerman = i18n.language?.startsWith('de');

  const toggleLanguage = () => {
    i18n.changeLanguage(isGerman ? 'en' : 'de');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="px-3 py-1 text-sm font-medium hover:text-primary transition-colors tracking-widest uppercase font-mono"
      aria-label="Toggle language"
    >
      {isGerman ? 'EN' : 'DE'}
    </button>
  );
}
