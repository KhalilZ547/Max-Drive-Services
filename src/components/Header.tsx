
'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
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
import { useState, useMemo, type MouseEvent } from 'react';
import { Logo } from './Logo';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';

export function Header() {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const navLinks = useMemo(() => [
    { href: '/#services', label: t('nav_services') },
    { href: '/ecu-tuning', label: t('nav_ecu_solutions') },
    { href: '/#donation', label: t('nav_donation') },
    { href: '/#contact', label: t('nav_contact') },
  ], [t]);

  const handleNavClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    setIsMenuOpen(false);
    const [path, id] = href.split('#');
    
    // If the link is for a section on the current page
    if (pathname === path && id) {
      e.preventDefault();
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    // If navigating to the homepage from another page to a section
    } else if (path === '/' && id) {
       e.preventDefault();
       router.push('/');
       // A small timeout allows the page to change before scrolling
       setTimeout(() => {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            }
       }, 100);
    }
    // For regular links (like /ecu-tuning), let the default Link behavior handle it.
  };

  return (
    <header className="bg-card/80 backdrop-blur-sm sticky top-0 z-40 w-full border-b">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-0 text-lg text-primary">
          <Logo className="h-10 w-10" />
          <span className="font-headline font-bold -ml-4">Max Drive Services</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                link.href === '/ecu-tuning'
                  ? 'text-primary font-semibold'
                  : 'text-muted-foreground'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/login">{t('nav_login')}</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">{t('nav_signup')}</Link>
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
                onClick={(e) => handleNavClick(e, link.href)}
                className={cn(
                  "text-lg font-medium hover:text-primary",
                  link.href === '/ecu-tuning'
                    ? 'text-primary font-semibold'
                    : 'text-muted-foreground'
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 mt-auto">
              <Button variant="outline" asChild>
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>{t('nav_login')}</Link>
              </Button>
              <Button asChild>
                <Link href="/signup" onClick={() => setIsMenuOpen(false)}>{t('nav_signup')}</Link>
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
