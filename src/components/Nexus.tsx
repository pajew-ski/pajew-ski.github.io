import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { MessageSquare, Fingerprint, Activity, MapPin } from 'lucide-react';

export function Nexus() {
  const { t } = useTranslation();

  const links = [
    { key: 'chatops', icon: MessageSquare, href: '#' },
    { key: 'signature', icon: Fingerprint, href: '#' },
    { key: 'federation', icon: Activity, href: '#' },
    { key: 'physical', icon: MapPin, href: '#' },
  ];

  return (
    <footer className="py-24 px-4 md:px-8 border-t border-border bg-background transition-colors duration-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">{t('nexus.h2')}</h2>
          <p className="text-muted-foreground max-w-md font-light">
            {t('nexus.copy')}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-12 gap-y-6">
          {links.map((link) => (
            <motion.a
              key={link.key}
              href={link.href}
              whileHover={{ x: 5 }}
              className="flex items-center gap-3 group text-muted-foreground hover:text-primary transition-colors"
            >
              <link.icon className="w-5 h-5 group-hover:text-primary transition-colors" strokeWidth={1.5} />
              <span className="text-sm font-medium uppercase tracking-widest">
                {t(`nexus.links.${link.key}`)}
              </span>
            </motion.a>
          ))}
        </div>
      </div>

      <div className="mt-24 text-center text-xs text-muted-foreground/30 font-mono uppercase tracking-widest">
        Digitales Nullpunkt-Feld v2.0
      </div>
    </footer>
  );
}
