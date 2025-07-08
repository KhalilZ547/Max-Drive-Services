'use client';

import { Toaster } from '@/components/ui/toaster';
import { GlobalThemeToggle } from '@/components/GlobalThemeToggle';
import dynamic from 'next/dynamic';

const AIChat = dynamic(() => import('@/components/AIChat').then(mod => mod.AIChat), {
  ssr: false,
});

export function GlobalComponents() {
  return (
    <>
      <Toaster />
      <GlobalThemeToggle />
      <AIChat />
    </>
  );
}
