
'use client';

import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/ThemeToggle';

export function GlobalThemeToggle() {
  const pathname = usePathname();
  const isDashboardPage = pathname.startsWith('/admin') || pathname.startsWith('/dashboard');

  if (isDashboardPage) {
    return null;
  }

  return <ThemeToggle className="fixed bottom-6 left-6" />;
}
