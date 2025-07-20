
"use client";

import { useState, useEffect } from 'react';
import { DashboardClient } from '@/components/DashboardClient';
import { LogoSpinner } from '@/components/LogoSpinner';
import { getVehiclesForUser } from '@/services/vehicles';
import { getServiceHistory } from './history/actions';
import type { VehicleData } from './vehicles/actions';
import type { ServiceHistoryItem } from './history/actions';

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [vehicles, setVehicles] = useState<VehicleData[]>([]);
  const [serviceHistory, setServiceHistory] = useState<ServiceHistoryItem[]>([]);
  
  useEffect(() => {
    async function loadDashboardData() {
        try {
            const [userVehicles, userHistory] = await Promise.all([
                getVehiclesForUser(),
                getServiceHistory()
            ]);
            setVehicles(userVehicles);
            setServiceHistory(userHistory);
        } catch (error) {
            console.error("Failed to load dashboard data", error);
            // Optionally show a toast error
        } finally {
            setIsLoading(false);
        }
    }
    loadDashboardData();
  }, []);

  if (isLoading) {
    return (
        <main className="flex flex-1 flex-col items-center justify-center gap-4 p-4 md:gap-8 md:p-8">
            <LogoSpinner className="h-32 w-32" />
            <p className="text-muted-foreground">Loading dashboard...</p>
        </main>
    )
  }
  
  // For now, reminders are mocked as an empty array.
  // A real implementation would calculate these based on service history.
  return <DashboardClient vehicles={vehicles} serviceHistory={serviceHistory} reminders={[]} />;
}
