
"use client";

import { useState, useEffect } from 'react';
import { DashboardClient } from '@/components/DashboardClient';
import { DashboardClientSkeleton } from '@/components/DashboardClientSkeleton';

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <DashboardClientSkeleton />;
  }
  
  return <DashboardClient />;
}
