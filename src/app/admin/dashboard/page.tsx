
'use client';

import { useState, useEffect } from "react";
import {
  Users,
  Car,
  Clock,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getClientsPerMonth, getTotalClientsCount } from "@/services/clients";
import { getTuningRequestStatusCounts, TuningRequestStatusCounts } from "@/services/tuning";
import { ClientsChart } from "@/components/charts/ClientsChart";
import { TuningRequestsChart } from "@/components/charts/TuningRequestsChart";
import type { MonthlyClient } from "@/services/clients";
import { LogoSpinner } from "@/components/LogoSpinner";

function StatCard({ title, value, icon: Icon }: { title: string; value: string | number; icon: React.ElementType; }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [totalClients, setTotalClients] = useState(0);
  const [clientsPerMonth, setClientsPerMonth] = useState<MonthlyClient[]>([]);
  const [tuningStatusCounts, setTuningStatusCounts] = useState<TuningRequestStatusCounts | null>(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [clientsCount, clientsData, statusCounts] = await Promise.all([
          getTotalClientsCount(),
          getClientsPerMonth(),
          getTuningRequestStatusCounts(),
        ]);
        setTotalClients(clientsCount);
        setClientsPerMonth(clientsData);
        setTuningStatusCounts(statusCounts);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        // Optionally, show a toast notification for the error
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading) {
    return (
        <main className="flex flex-1 flex-col items-center justify-center gap-4 p-4 md:gap-8 md:p-8">
            <LogoSpinner className="h-32 w-32" />
            <p className="text-muted-foreground">Loading admin dashboard...</p>
        </main>
    )
  }

  const totalRequests = tuningStatusCounts 
    ? tuningStatusCounts.Pending + tuningStatusCounts['Awaiting Payment'] + tuningStatusCounts.Completed
    : 0;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        <StatCard title="Total Clients" value={totalClients} icon={Users} />
        <StatCard title="Total Tuning Requests" value={totalRequests} icon={Car} />
        <StatCard title="Pending Requests" value={tuningStatusCounts?.Pending ?? 0} icon={Clock} />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle>New Clients Overview</CardTitle>
            <CardDescription>
              You've gained {totalClients} clients so far.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ClientsChart data={clientsPerMonth} />
          </CardContent>
        </Card>
        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>Tuning Requests</CardTitle>
            <CardDescription>
              A summary of all ECU tuning requests.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {tuningStatusCounts && <TuningRequestsChart data={tuningStatusCounts} />}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
