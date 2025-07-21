
'use client';
import Link from 'next/link';
import {
  Users,
  Home,
  LogOut,
  PanelLeft,
  Cpu,
  Settings,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useEffect, useState, useCallback, memo, MouseEvent } from 'react';
import { Logo } from '@/components/Logo';
import { LogoSpinner } from '@/components/LogoSpinner';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useToast } from '@/hooks/use-toast';

const navItems = [
  { href: '/admin/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/admin/clients', icon: Users, label: 'Clients' },
  { href: '/admin/tuning', icon: Cpu, label: 'Tuning Requests' },
  { href: '/admin/settings', icon: Settings, label: 'Site Settings' },
];

const NavContent = memo(() => {
  const pathname = usePathname();
  return (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.href);
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

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthorizing, setIsAuthorizing] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const role = localStorage.getItem('userRole');
      if (role !== 'admin') {
        router.push('/login');
      } else {
        setIsAuthorizing(false);
      }
    }
  }, [router]);

  const handleLogout = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userRole');
      localStorage.removeItem('userId');
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

  if (isAuthorizing) {
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
            <Link href="/admin/dashboard" onClick={handleLogoClick} className="flex items-center gap-0 text-primary text-lg">
              <Logo className="h-10 w-10" />
              <span className="font-headline font-bold -ml-4">Admin Panel</span>
            </Link>
          </div>
          <div className="flex-1">
            <NavContent />
          </div>
          <div className="mt-auto p-4">
            <div className="flex items-center gap-2">
              <Button size="sm" className="w-full" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4"/>
                  Logout
              </Button>
              <ThemeToggle variant="icon" />
            </div>
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
              <div className="mt-auto space-y-2">
                <ThemeToggle variant="icon" className="w-full h-10" />
                <Button size="sm" className="w-full" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4"/>
                    Logout
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
             <Link href="/admin/dashboard" onClick={handleLogoClick} className="flex items-center gap-0 text-primary text-lg">
              <Logo className="h-10 w-10" />
              <span className="font-headline font-bold -ml-4">Admin Panel</span>
            </Link>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
