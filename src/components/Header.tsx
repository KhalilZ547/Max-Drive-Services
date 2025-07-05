'use client';

import Link from 'next/link';
import { Menu, X, Instagram, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/use-translation';
import type { Language } from '@/lib/translations';
import React from 'react';
import { Logo } from './Logo';
import { WhatsappIcon } from './WhatsappIcon';

export function Header() {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const navLinks = [
    { href: '#services', label: t('nav_services') },
    { href: '#testimonials', label: t('nav_testimonials') },
    { href: '#contact', label: t('nav_contact') },
  ];

  return (
    <header className="bg-card/80 backdrop-blur-sm sticky top-0 z-40 w-full border-b">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-lg text-primary">
          <Logo className="h-10 w-10" />
          <span className="font-headline font-bold text-foreground">Max Drive Services</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-1">
           <Button variant="ghost" size="icon" asChild>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
           </Button>
            <Button variant="ghost" size="icon" asChild>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                    <Facebook className="h-5 w-5" />
                </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
                <a href="https://wa.me/21612345678" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                    <WhatsappIcon className="h-5 w-5" />
                </a>
            </Button>

          <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
            <SelectTrigger className="w-28 text-sm">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="ar">العربية</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" asChild>
            <Link href="/login">{t('nav_login')}</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">{t('nav_signup')}</Link>
          </Button>
        </div>
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-card border-t">
          <div className="container py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-lg font-medium text-muted-foreground hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
             <div className="flex justify-center gap-4 my-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Facebook className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
              </a>
              <a href="https://wa.me/21612345678" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <WhatsappIcon className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
              </a>
            </div>
            <div className="flex flex-col gap-2 mt-auto">
              <Button variant="outline" asChild>
                <Link href="/login">{t('nav_login')}</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">{t('nav_signup')}</Link>
              </Button>
              <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
                <SelectTrigger className="w-full text-sm">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="ar">العربية</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
