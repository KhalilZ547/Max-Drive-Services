
"use client";

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import { VehiclesPageSkeleton } from '@/components/VehiclesPageSkeleton';
import { Car, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Mock data has been removed to prepare for database integration.
// In a real app, this data would be fetched based on the logged-in user.
const vehicles: { make: string; model: string; year: number; vin: string; }[] = [];

export default function VehiclesPage() {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // In a real app, you would fetch user-specific data here.
        const timer = setTimeout(() => setIsLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return <VehiclesPageSkeleton />;
    }

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <Card>
                <CardHeader>
                    <CardTitle>{t('tab_vehicles')}</CardTitle>
                    <CardDescription>{t('vehicles_page_description')}</CardDescription>
                </CardHeader>
                <CardContent>
                    {vehicles.length > 0 ? (
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
                    ) : (
                       <div className="text-center py-16">
                            <Car className="mx-auto h-12 w-12 text-muted-foreground" />
                            <h3 className="mt-4 text-lg font-semibold">{t('vehicles_page_no_vehicles')}</h3>
                            <p className="mt-2 text-sm text-muted-foreground">Add your vehicle to easily book future appointments.</p>
                            <Button className="mt-4">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                {t('add_vehicle_button')}
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </main>
    );
}
