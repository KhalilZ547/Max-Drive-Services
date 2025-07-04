"use client";

import {
  Car,
  History,
  BellRing,
} from "lucide-react";
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "@/hooks/use-translation";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Button } from "./ui/button";


const vehicles: { make: string; model: string; year: number; vin: string; }[] = [];

const serviceHistory: { vehicle: string; service: string; date: string; cost: string; }[] = [];

const reminders: { title: string; date: string; details: string; }[] = [];

export function DashboardClient() {
  const { t } = useTranslation();

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
      </div>
      <Tabs defaultValue="vehicles">
        <TabsList>
          <TabsTrigger value="vehicles">{t('tab_vehicles')}</TabsTrigger>
          <TabsTrigger value="history">{t('tab_history')}</TabsTrigger>
          <TabsTrigger value="reminders">{t('tab_reminders')}</TabsTrigger>
        </TabsList>
        <TabsContent value="vehicles">
          <Card>
            <CardHeader>
              <CardTitle>{t('tab_vehicles')}</CardTitle>
              <CardDescription>Manage your registered vehicles.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {vehicles.map((vehicle, index) => (
                    <Card key={index}>
                        <CardHeader>
                            <CardTitle>{vehicle.make} {vehicle.model}</CardTitle>
                            <CardDescription>{vehicle.year} - VIN: {vehicle.vin}</CardDescription>
                        </CardHeader>
                    </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>{t('tab_history')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('service_history_vehicle')}</TableHead>
                    <TableHead>{t('service_history_service')}</TableHead>
                    <TableHead>{t('service_history_date')}</TableHead>
                    <TableHead>{t('service_history_cost')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {serviceHistory.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.vehicle}</TableCell>
                      <TableCell>{item.service}</TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>{item.cost}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reminders">
            <Card>
                <CardHeader>
                    <CardTitle>{t('reminders_title')}</CardTitle>
                    <CardDescription>Stay on top of your vehicle's maintenance schedule.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        {reminders.map((reminder, index) => (
                            <AccordionItem value={`item-${index}`} key={index}>
                                <AccordionTrigger>
                                    <div className="flex justify-between w-full pr-4">
                                        <span>{reminder.title}</span>
                                        <span className="text-muted-foreground">{reminder.date}</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    {reminder.details}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
