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
import React from 'react';
import { Logo } from '@/components/Logo';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { href: '/dashboard', icon: Home, label: t('nav_dashboard') },
    { href: '/dashboard/appointment', icon: CalendarPlus, label: t('nav_appointment') },
    { href: '/dashboard/vehicles', icon: Car, label: t('tab_vehicles') },
    { href: '/dashboard/history', icon: History, label: t('tab_history') },
    { href: '/dashboard/profile', icon: CircleUser, label: 'Profile' },
  ];

  const handleLogout = () => {
    // Mock logout
    router.push('/');
  }

  const NavContent = () => (
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

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-card md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 text-primary text-lg">
              <Logo className="h-10 w-10" />
              <span className="font-headline font-bold">Max Drive Services</span>
            </Link>
          </div>
          <div className="flex-1">
            <NavContent />
          </div>
          <div className="mt-auto p-4">
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
              <NavContent />
              <div className="mt-auto">
                <Button size="sm" className="w-full" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4"/>
                    {t('logout')}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
             <Link href="/" className="flex items-center gap-2 text-primary text-lg">
              <Logo className="h-10 w-10" />
              <span className="font-headline font-bold">Max Drive Services</span>
            </Link>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
