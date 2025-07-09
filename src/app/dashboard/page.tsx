
"use client";

import { useState, useEffect } from 'react';
import { DashboardClient } from '@/components/DashboardClient';
import { LogoSpinner } from '@/components/LogoSpinner';

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
        <main className="flex flex-1 flex-col items-center justify-center gap-4 p-4 md:gap-8 md:p-8">
            <LogoSpinner className="h-32 w-32" />
            <p className="text-muted-foreground">Loading dashboard...</p>
        </main>
    )
  }
  
  return <DashboardClient />;
}
