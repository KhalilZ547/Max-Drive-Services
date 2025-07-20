
"use client";

import { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import { VehiclesPageSkeleton } from '@/components/VehiclesPageSkeleton';
import { Car, PlusCircle, MoreVertical } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { getVehicles, addVehicle, updateVehicle, deleteVehicle, type VehicleData } from './actions';
import { AddVehicleDialog } from '@/components/AddVehicleDialog';
import { EditVehicleDialog } from '@/components/EditVehicleDialog';
import { useToast } from '@/hooks/use-toast';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type Vehicle = Omit<VehicleData, 'id'> & { id?: string };


export default function VehiclesPage() {
    const { t } = useTranslation();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [vehicles, setVehicles] = useState<VehicleData[]>([]);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState<VehicleData | null>(null);
    const [deletingVehicleId, setDeletingVehicleId] = useState<string | null>(null);

    const fetchVehicles = useCallback(async () => {
        setIsLoading(true);
        try {
            const fetchedVehicles = await getVehicles();
            setVehicles(fetchedVehicles as VehicleData[]);
        } catch (error) {
            toast({ title: "Error", description: "Could not fetch your vehicles. Please try refreshing the page.", variant: "destructive" });
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
            toast({ title: "Vehicle Added", description: `Your ${data.make} ${data.model} has been successfully registered.` });
            setIsAddDialogOpen(false);
            fetchVehicles(); // Refresh list
        } else {
            toast({ title: "Failed to Add Vehicle", description: result.error, variant: "destructive" });
        }
    }, [fetchVehicles, toast]);
    
    const handleUpdateVehicle = useCallback(async (vehicleId: string, data: Omit<Vehicle, 'id'>) => {
        const result = await updateVehicle(vehicleId, data);
        if (result.success) {
            toast({ title: "Vehicle Updated", description: "Your vehicle details have been saved." });
            setEditingVehicle(null);
            fetchVehicles();
        } else {
            toast({ title: "Update Failed", description: result.error, variant: "destructive" });
        }
    }, [fetchVehicles, toast]);

    const confirmDelete = useCallback(async () => {
        if (!deletingVehicleId) return;
        const result = await deleteVehicle(deletingVehicleId);
        if(result.success) {
            toast({ title: "Vehicle Deleted", description: "The vehicle has been removed from your garage." });
            setDeletingVehicleId(null);
            fetchVehicles();
        } else {
            toast({ title: "Delete Failed", description: result.error, variant: "destructive" });
        }
    }, [deletingVehicleId, fetchVehicles, toast]);

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
                                {vehicles.map((vehicle) => (
                                    <Card key={vehicle.id} className="flex flex-col">
                                        <CardHeader className="flex-row gap-4 items-start pb-4">
                                            <Car className="w-8 h-8 text-primary mt-1" />
                                            <div className="flex-1">
                                                <CardTitle className="text-xl">{vehicle.make} {vehicle.model}</CardTitle>
                                                <CardDescription>{vehicle.year}</CardDescription>
                                            </div>
                                             <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="shrink-0">
                                                        <MoreVertical className="h-5 w-5" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onSelect={() => setEditingVehicle(vehicle)}>
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onSelect={() => setDeletingVehicleId(vehicle.id)} className="text-destructive focus:text-destructive">
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </CardHeader>
                                        <CardFooter className="mt-auto">
                                            <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
                                              VIN: {vehicle.vin || 'Not Provided'}
                                            </p>
                                        </CardFooter>
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
             {editingVehicle && (
                <EditVehicleDialog
                    isOpen={!!editingVehicle}
                    onOpenChange={(open) => {
                      if (!open) setEditingVehicle(null);
                    }}
                    vehicle={editingVehicle}
                    onUpdateVehicle={handleUpdateVehicle}
                />
            )}
            <AlertDialog open={!!deletingVehicleId} onOpenChange={(open) => {if(!open) setDeletingVehicleId(null)}}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this vehicle from your records.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className={buttonVariants({ variant: "destructive" })}
                        >
                            Delete Vehicle
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
