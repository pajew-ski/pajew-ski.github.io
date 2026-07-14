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
      className="text-xs font-medium tracking-widest uppercase hover:opacity-100 transition-opacity cursor-pointer"
      aria-label="Toggle language"
    >
      {isGerman ? 'EN' : 'DE'}
    </button>
  );
}
