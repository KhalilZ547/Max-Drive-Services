
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

// Mock data, in a real app this would come from a database
const vehicles = [
    { make: 'Toyota', model: 'Camry', year: 2021, vin: '1234567890ABCDEFG' },
    { make: 'Honda', model: 'Civic', year: 2019, vin: 'GFEDCBA0987654321' },
];

export default function VehiclesPage() {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
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
                        <p>{t('vehicles_page_no_vehicles')}</p>
                    )}
                </CardContent>
            </Card>
        </main>
    );
}
