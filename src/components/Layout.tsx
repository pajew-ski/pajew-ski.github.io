import React from 'react';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSwitcher } from './LanguageSwitcher';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <nav className="fixed top-6 right-8 z-50 flex items-center gap-6 mix-blend-difference text-white pointer-events-auto">
        <LanguageSwitcher />
        <ThemeToggle />
      </nav>
      <main className="w-full relative">
        {children}
      </main>
    </div>
  );
}
