"use client";

import {
  Car,
  CircleUser,
  History,
  LogOut,
  PlusCircle,
  BellRing,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";


const vehicles = [
  { make: "Toyota", model: "Camry", year: 2021, vin: "123ABC456DEF" },
  { make: "Honda", model: "Civic", year: 2022, vin: "789GHI012JKL" },
];

const serviceHistory = [
  { vehicle: "Toyota Camry", service: "Oil Change", date: "2023-05-15", cost: "$75" },
  { vehicle: "Honda Civic", service: "Brake Repair", date: "2023-06-20", cost: "$350" },
  { vehicle: "Toyota Camry", service: "Tire Rotation", date: "2023-09-01", cost: "$50" },
];

const reminders = [
    { title: "Oil Change Due for Toyota Camry", date: "2024-08-15", details: "Next scheduled oil change is approaching. Book an appointment to keep your engine running smoothly." },
    { title: "Annual Inspection for Honda Civic", date: "2024-09-01", details: "It's time for your yearly vehicle inspection to ensure everything is in top condition." },
]

export function DashboardClient() {
  const { t } = useTranslation();

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
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>{t('tab_vehicles')}</CardTitle>
                    <CardDescription>Manage your registered vehicles.</CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-1">
                      <PlusCircle className="h-3.5 w-3.5" />
                      {t('add_vehicle_button')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t('add_vehicle_title')}</DialogTitle>
                      <DialogDescription>{t('add_vehicle_desc')}</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="make" className="text-right">{t('vehicle_make')}</Label>
                        <Input id="make" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="model" className="text-right">{t('vehicle_model')}</Label>
                        <Input id="model" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="year" className="text-right">{t('vehicle_year')}</Label>
                        <Input id="year" type="number" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="vin" className="text-right">{t('vehicle_vin')}</Label>
                        <Input id="vin" className="col-span-3" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">{t('submit_button')}</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
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
