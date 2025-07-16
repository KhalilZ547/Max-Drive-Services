
"use client";

import { useState, useEffect, useCallback } from 'react';
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
import { getVehicles, addVehicle } from './actions';
import { AddVehicleDialog } from '@/components/AddVehicleDialog';
import { useToast } from '@/hooks/use-toast';

type Vehicle = { make: string; model: string; year: number; vin: string; };

export default function VehiclesPage() {
    const { t } = useTranslation();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    const fetchVehicles = useCallback(async () => {
        setIsLoading(true);
        try {
            const fetchedVehicles = await getVehicles();
            setVehicles(fetchedVehicles as Vehicle[]);
        } catch (error) {
            toast({ title: "Error", description: "Could not fetch vehicles.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchVehicles();
    }, [fetchVehicles]);

    const handleAddVehicle = useCallback(async (data: Omit<Vehicle, 'id'>) => {
        const result = await addVehicle(data);
        if (result.success) {
            toast({ title: "Vehicle Added", description: "Your vehicle has been successfully registered." });
            setIsAddDialogOpen(false);
            fetchVehicles(); // Refresh list
        } else {
            toast({ title: "Failed to Add Vehicle", description: result.error, variant: "destructive" });
        }
    }, [fetchVehicles, toast]);

    if (isLoading) {
        return <VehiclesPageSkeleton />;
    }

    return (
        <>
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>{t('tab_vehicles')}</CardTitle>
                            <CardDescription>{t('vehicles_page_description')}</CardDescription>
                        </div>
                        {vehicles.length > 0 && (
                            <Button onClick={() => setIsAddDialogOpen(true)}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                {t('add_vehicle_button')}
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent>
                        {vehicles.length > 0 ? (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {vehicles.map((vehicle, index) => (
                                    <Card key={index}>
                                        <CardHeader>
                                            <CardTitle>{vehicle.make} {vehicle.model}</CardTitle>
                                            <CardDescription>{vehicle.year} - VIN: {vehicle.vin || 'N/A'}</CardDescription>
                                        </CardHeader>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                           <div className="text-center py-16">
                                <Car className="mx-auto h-12 w-12 text-muted-foreground" />
                                <h3 className="mt-4 text-lg font-semibold">{t('vehicles_page_no_vehicles')}</h3>
                                <p className="mt-2 text-sm text-muted-foreground">Add your vehicle to easily book future appointments.</p>
                                <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    {t('add_vehicle_button')}
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>
            <AddVehicleDialog 
                isOpen={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
                onAddVehicle={handleAddVehicle}
            />
        </>
    );
}
