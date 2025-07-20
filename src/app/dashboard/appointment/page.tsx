
"use client";

import { useState, useEffect, Suspense } from 'react';
import { AppointmentForm } from "@/components/AppointmentForm";
import { AppointmentFormSkeleton } from "@/components/AppointmentFormSkeleton";
import { getVehiclesForUser } from '@/services/vehicles';
import type { VehicleData } from '@/app/dashboard/vehicles/actions';

function AppointmentPageComponent() {
  const [isLoading, setIsLoading] = useState(true);
  const [vehicles, setVehicles] = useState<VehicleData[]>([]);

  useEffect(() => {
    async function loadData() {
        try {
            const userVehicles = await getVehiclesForUser();
            setVehicles(userVehicles);
        } catch (error) {
            console.error("Failed to load user vehicles for appointment form", error);
        } finally {
            setIsLoading(false);
        }
    }
    loadData();
  }, []);

  if (isLoading) {
    return <AppointmentFormSkeleton />;
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <AppointmentForm userVehicles={vehicles} />
    </main>
  );
}

export default function AppointmentPage() {
    return (
        <Suspense fallback={<AppointmentFormSkeleton />}>
            <AppointmentPageComponent />
        </Suspense>
    )
}
