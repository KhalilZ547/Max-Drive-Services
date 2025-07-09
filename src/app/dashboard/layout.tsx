
'use client';
import Link from 'next/link';
import {
  Car,
  CircleUser,
  History,
  Home,
  LogOut,
  PanelLeft,
  CalendarPlus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useTranslation } from '@/hooks/use-translation';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { memo, useMemo, useCallback, MouseEvent, useState, useEffect } from 'react';
import { Logo } from '@/components/Logo';
import { LogoSpinner } from '@/components/LogoSpinner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Language } from '@/lib/translations';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useToast } from '@/hooks/use-toast';

const NavContent = memo(({ navItems }: { navItems: { href: string; icon: React.ElementType; label: string }[] }) => {
  const pathname = usePathname();
  return (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
              isActive && 'bg-muted text-primary'
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
});
NavContent.displayName = 'NavContent';

const LanguageSelector = memo(() => {
  const { language, setLanguage } = useLanguage();
  return (
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
  );
});
LanguageSelector.displayName = 'LanguageSelector';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const { toast } = useToast();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const role = localStorage.getItem('userRole');
      if (role !== 'client') {
        router.push('/login');
      } else {
        setIsAuthorized(true);
      }
    }
  }, [router]);

  const navItems = useMemo(() => [
    { href: '/dashboard', icon: Home, label: t('nav_dashboard') },
    { href: '/dashboard/appointment', icon: CalendarPlus, label: t('nav_appointment') },
    { href: '/dashboard/vehicles', icon: Car, label: t('tab_vehicles') },
    { href: '/dashboard/history', icon: History, label: t('tab_history') },
    { href: '/dashboard/profile', icon: CircleUser, label: 'Profile' },
  ], [t]);

  const handleLogout = useCallback(() => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('userRole');
    }
    router.push('/login');
  }, [router]);

  const handleLogoClick = useCallback((e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    toast({
      title: "Navigation Info",
      description: "To return to the public home page, please log out first.",
    });
  }, [toast]);

  if (!isAuthorized) {
      return (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-4 md:gap-8 md:p-8 min-h-screen">
            <LogoSpinner className="h-32 w-32" />
            <p className="text-muted-foreground">Verifying authorization...</p>
        </div>
      )
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-card md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/dashboard" onClick={handleLogoClick} className="flex items-center gap-0 text-primary text-lg">
              <Logo className="h-10 w-10" />
              <span className="font-headline font-bold -ml-4">Max Drive Services</span>
            </Link>
          </div>
          <div className="flex-1">
            <NavContent navItems={navItems} />
          </div>
          <div className="mt-auto p-4 space-y-4">
             <div className="flex w-full items-center gap-2">
                <LanguageSelector />
                <ThemeToggle variant="icon" className="shrink-0" />
             </div>
             <Button size="sm" className="w-full" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4"/>
                {t('logout')}
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <NavContent navItems={navItems} />
              <div className="mt-auto space-y-4">
                <div className="flex w-full items-center gap-2">
                    <LanguageSelector />
                    <ThemeToggle variant="icon" className="shrink-0" />
                </div>
                <Button size="sm" className="w-full" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4"/>
                    {t('logout')}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
             <Link href="/dashboard" onClick={handleLogoClick} className="flex items-center gap-0 text-primary text-lg">
              <Logo className="h-10 w-10" />
              <span className="font-headline font-bold -ml-4">Max Drive Services</span>
            </Link>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
