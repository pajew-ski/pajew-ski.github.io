import React from 'react';
import { Github } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ChatWidget } from './ChatWidget';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
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
        <LanguageSwitcher />
        <ThemeToggle />
      </nav>
      <main className="w-full relative">
        {children}
      </main>
      <ChatWidget />
    </div>
  );
}
