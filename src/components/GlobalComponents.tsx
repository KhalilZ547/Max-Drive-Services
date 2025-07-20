'use client';

import dynamic from 'next/dynamic';
import { Toaster } from '@/components/ui/toaster';
import { GlobalThemeToggle } from '@/components/GlobalThemeToggle';

// The AIChat component has been removed to resolve persistent errors.
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
