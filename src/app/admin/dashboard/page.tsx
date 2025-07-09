
"use client";

import { useMemo, useState, useEffect } from "react";
import {
  Users,
  Car,
  CalendarCheck,
} from "lucide-react";
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAdminClients } from "@/hooks/use-admin-clients";
import { AdminDashboardSkeleton } from "@/components/AdminDashboardSkeleton";


export default function AdminDashboardPage() {
  const { clients } = useAdminClients();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const stats = useMemo(() => ({
    totalClients: clients.length,
    totalVehicles: 78,
    upcomingAppointments: 12,
  }), [clients.length]);

  if (isLoading) {
    return <AdminDashboardSkeleton />;
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <CardHeader className="px-0">
            <CardTitle>Admin Dashboard</CardTitle>
            <CardDescription>Overview of the garage's activity.</CardDescription>
        </CardHeader>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClients}</div>
            <p className="text-xs text-muted-foreground">
              +5 since last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vehicles Serviced</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVehicles}</div>
            <p className="text-xs text-muted-foreground">
              Total vehicles in the system
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingAppointments}</div>
            <p className="text-xs text-muted-foreground">
              In the next 7 days
            </p>
          </CardContent>
        </Card>
      </div>
       <div className="grid gap-4 md:grid-cols-1">
        <Card>
            <CardHeader>
                <CardTitle>Client Management</CardTitle>
                <CardDescription>View, add, or manage client information.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild>
                    <Link href="/admin/clients">Go to Clients Page</Link>
                </Button>
            </CardContent>
        </Card>
      </div>
    </main>
  );
}
