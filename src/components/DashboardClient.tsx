
"use client";

import {
  Car,
  History,
  BellRing,
  CalendarPlus,
} from "lucide-react";
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { LogoSpinner } from "./LogoSpinner";

const vehicles: { make: string; model: string; year: number; vin: string; }[] = [
    { make: 'Toyota', model: 'Camry', year: 2021, vin: '1234567890ABCDEFG' },
    { make: 'Honda', model: 'Civic', year: 2019, vin: 'GFEDCBA0987654321' },
];

const serviceHistory: { vehicle: string; service: string; date: string; cost: number; }[] = [
    { vehicle: 'Toyota Camry 2021', service: 'Oil Change', date: '2023-10-26', cost: 50.00 },
    { vehicle: 'Honda Civic 2019', service: 'Brake Repair', date: '2023-09-15', cost: 250.00 },
    { vehicle: 'Toyota Camry 2021', service: 'Engine Diagnostic', date: '2023-11-05', cost: 100.00 },
];
const TND_TO_EUR_RATE = 0.3; // Approximate conversion rate

const reminders: { title: string; date: string; details: string; }[] = [
    { title: 'Oil Change due', date: '2024-08-15', details: 'Your Toyota Camry is due for an oil change.'}
];

export function DashboardClient() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
        <main className="flex flex-1 flex-col items-center justify-center gap-4 p-4 md:gap-8 md:p-8">
            <LogoSpinner className="h-32 w-32" />
            <p className="text-muted-foreground">Loading your dashboard...</p>
        </main>
      )
  }

  if (vehicles.length === 0) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4 p-4 md:gap-8 md:p-8 text-center">
        <Card className="w-full max-w-lg">
            <CardHeader>
                <CardTitle className="text-3xl">{t('welcome_title')}</CardTitle>
                <CardDescription>{t('welcome_subtitle')}</CardDescription>
            </CardHeader>
            <CardContent>
                <Button size="lg" asChild>
                    <Link href="/dashboard/appointment">{t('book_appointment_cta')}</Link>
                </Button>
            </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('tab_vehicles')}</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vehicles.length}</div>
            <p className="text-xs text-muted-foreground">
              Vehicles registered
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('tab_history')}</CardTitle>
            <History className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{serviceHistory.length}</div>
            <p className="text-xs text-muted-foreground">
              Total services completed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('tab_reminders')}</CardTitle>
            <BellRing className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reminders.length}</div>
            <p className="text-xs text-muted-foreground">
              Upcoming reminders
            </p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('nav_appointment')}</CardTitle>
            <CalendarPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Button asChild className="mt-2 w-full">
              <Link href="/dashboard/appointment">{t('book_now_button')}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle>{t('reminders_title')}</CardTitle>
                <CardDescription>{t('dashboard_reminders_desc')}</CardDescription>
            </CardHeader>
            <CardContent>
                {reminders.length > 0 ? (
                      <ul className="space-y-2">
                        {reminders.map((reminder, index) => (
                            <li key={index} className="flex justify-between items-center p-2 rounded-lg bg-muted">
                                <div>
                                    <p className="font-semibold">{reminder.title}</p>
                                    <p className="text-sm text-muted-foreground">{reminder.details}</p>
                                </div>
                                <span className="text-sm font-medium">{reminder.date}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>{t('dashboard_no_reminders')}</p>
                )}
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>{t('dashboard_recent_activity_title')}</CardTitle>
                <CardDescription>{t('dashboard_recent_activity_desc')}</CardDescription>
            </CardHeader>
            <CardContent>
                  {serviceHistory.length > 0 ? (
                      <ul className="space-y-2">
                        {serviceHistory.slice(0, 3).map((item, index) => (
                            <li key={index} className="flex justify-between items-center p-2 rounded-lg bg-muted">
                                <div>
                                    <p className="font-semibold">{item.service} for {item.vehicle}</p>
                                    <p className="text-sm text-muted-foreground">on {item.date}</p>
                                </div>
                                <span className="text-sm font-medium whitespace-nowrap">{item.cost.toFixed(2)} TND (€{(item.cost * TND_TO_EUR_RATE).toFixed(2)})</span>
                            </li>
                        ))}
                    </ul>
                  ) : (
                      <p>{t('dashboard_no_recent_activity')}</p>
                  )}
                  {serviceHistory.length > 3 && (
                    <Button variant="link" asChild className="mt-2 p-0 h-auto">
                        <Link href="/dashboard/history">{t('dashboard_view_all_history')}</Link>
                    </Button>
                )}
            </CardContent>
        </Card>
      </div>
    </main>
  );
}
