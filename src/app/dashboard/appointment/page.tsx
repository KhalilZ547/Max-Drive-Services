
"use client";

import { useState, useEffect } from 'react';
import { AppointmentForm } from "@/components/AppointmentForm";
import { AppointmentFormSkeleton } from "@/components/AppointmentFormSkeleton";

export default function AppointmentPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <AppointmentFormSkeleton />;
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <AppointmentForm />
    </main>
  );
}
