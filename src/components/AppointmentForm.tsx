
"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2, PlusCircle, Car } from "lucide-react";
import { useSearchParams, useRouter } from 'next/navigation';

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { addAppointment } from "@/services/appointments";
import type { VehicleData } from "@/app/dashboard/vehicles/actions";
import { AddVehicleDialog } from "./AddVehicleDialog";
import { addVehicle } from "@/app/dashboard/vehicles/actions";


const services = [
    { id: 'oil-change', key: 'service_oil_change_title'},
    { id: 'brake-repair', key: 'service_brake_repair_title' },
    { id: 'engine-diagnostic', key: 'service_engine_diagnostic_title' },
    { id: 'ecu-solutions', key: 'service_ecu_solutions_title' },
    { id: 'other', key: 'service_other_title' },
];

const NEW_VEHICLE_VALUE = 'add_new_vehicle';

export function AppointmentForm({ userVehicles }: { userVehicles: VehicleData[] }) {
    const { t } = useTranslation();
    const { toast } = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialService = searchParams.get('service');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAddVehicleDialogOpen, setIsAddVehicleDialogOpen] = useState(false);
    const [vehicles, setVehicles] = useState(userVehicles);

    const AppointmentFormSchema = useMemo(() => z.object({
        serviceIds: z.array(z.string()).refine((value) => value.some((item) => item), {
            message: "You have to select at least one service.",
        }),
        vehicleId: z.string({ required_error: "Please select a vehicle."}),
        appointmentDate: z.date({
            required_error: "A date for the appointment is required.",
        }),
        notes: z.string().optional(),
        otherService: z.string().optional(),
        }).refine((data) => {
            if (data.serviceIds.includes('other')) {
                return data.otherService && data.otherService.trim().length > 2;
            }
            return true;
        }, {
            message: t('other_service_error'),
            path: ["otherService"],
        }), [t]
    );

    const form = useForm<z.infer<typeof AppointmentFormSchema>>({
        resolver: zodResolver(AppointmentFormSchema),
        defaultValues: {
            serviceIds: initialService ? [initialService] : [],
            notes: "",
            otherService: "",
        },
    });

    useEffect(() => {
        if (initialService) {
            form.setValue('serviceIds', [initialService]);
        }
    }, [initialService, form]);


    const selectedServices = form.watch("serviceIds");
    const selectedVehicleId = form.watch("vehicleId");
    
    useEffect(() => {
        if (selectedVehicleId === NEW_VEHICLE_VALUE) {
            setIsAddVehicleDialogOpen(true);
            // Reset the form value if dialog is closed without adding
            form.setValue('vehicleId', '');
        }
    }, [selectedVehicleId, form]);

    const handleAddVehicle = useCallback(async (newVehicleData: Omit<VehicleData, 'id'>) => {
        const result = await addVehicle(newVehicleData);
        if (result.success && result.newVehicleId) {
            toast({ title: "Vehicle Added", description: `Your ${newVehicleData.make} ${newVehicleData.model} has been successfully registered.` });
            
            const newVehicleEntry = { ...newVehicleData, id: result.newVehicleId };
            const updatedVehicles = [...vehicles, newVehicleEntry];
            setVehicles(updatedVehicles);

            form.setValue('vehicleId', result.newVehicleId);
            setIsAddVehicleDialogOpen(false);
        } else {
            toast({ title: "Failed to Add Vehicle", description: result.error, variant: "destructive" });
        }
    }, [vehicles, form, toast]);


    async function onSubmit(data: z.infer<typeof AppointmentFormSchema>) {
        setIsSubmitting(true);
        try {
            const serviceNames = data.serviceIds.map(id => {
                if (id === 'other') return data.otherService;
                return t(services.find(s => s.id === id)?.key as any);
            }).join(', ');
            
            const result = await addAppointment({ ...data, services: serviceNames });

            if(result.success) {
                const formattedDate = format(data.appointmentDate, "PPP");
                toast({
                    title: t('appointment_booked_title'),
                    description: `${t('appointment_booked_desc')} ${serviceNames} ${t('on')} ${formattedDate}.`,
                });
                router.push('/dashboard');
            } else {
                toast({ title: "Booking Failed", description: result.error, variant: "destructive" });
            }
        } catch (error) {
            console.error("Appointment submission error:", error);
            toast({
                title: "Booking Failed",
                description: "We couldn't schedule your appointment. Please try again or contact us directly.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    }
    
    return (
        <>
        <Card>
            <CardHeader>
                <CardTitle>{t('appointment_page_title')}</CardTitle>
                <CardDescription>{t('appointment_page_subtitle')}</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="serviceIds"
                            render={() => (
                                <FormItem>
                                    <div className="mb-4">
                                        <FormLabel>{t('service_label')}</FormLabel>
                                        <FormDescription>
                                            Select all services you require.
                                        </FormDescription>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {services.map((item) => (
                                            <FormField
                                            key={item.id}
                                            control={form.control}
                                            name="serviceIds"
                                            render={({ field }) => {
                                                return (
                                                <FormItem
                                                    key={item.id}
                                                    className="flex flex-row items-start space-x-3 space-y-0"
                                                >
                                                    <FormControl>
                                                    <Checkbox
                                                        checked={field.value?.includes(item.id)}
                                                        onCheckedChange={(checked) => {
                                                        return checked
                                                            ? field.onChange([...(field.value || []), item.id])
                                                            : field.onChange(
                                                                field.value?.filter(
                                                                (value) => value !== item.id
                                                                )
                                                            )
                                                        }}
                                                    />
                                                    </FormControl>
                                                    <FormLabel className="font-normal">
                                                        {t(item.key as any)}
                                                    </FormLabel>
                                                </FormItem>
                                                )
                                            }}
                                            />
                                        ))}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {selectedServices?.includes('other') && (
                            <FormField
                                control={form.control}
                                name="otherService"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('other_service_label')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t('other_service_placeholder')} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <FormField
                            control={form.control}
                            name="vehicleId"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Vehicle</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a registered vehicle" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {vehicles.map(vehicle => (
                                            <SelectItem key={vehicle.id} value={vehicle.id}>
                                               <span className="flex items-center"><Car className="mr-2 h-4 w-4" /> {vehicle.make} {vehicle.model} ({vehicle.year})</span>
                                            </SelectItem>
                                        ))}
                                        <SelectItem value={NEW_VEHICLE_VALUE}>
                                           <span className="flex items-center text-primary"><PlusCircle className="mr-2 h-4 w-4" /> Add a new vehicle...</span>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        

                         <FormField
                            control={form.control}
                            name="appointmentDate"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                <FormLabel>{t('date_label')}</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-[240px] pl-3 text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                        )}
                                        >
                                        {field.value ? (
                                            format(field.value, "PPP")
                                        ) : (
                                            <span>{t('date_placeholder')}</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) =>
                                            date < new Date(new Date().setHours(0,0,0,0))
                                        }
                                        initialFocus
                                    />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>{t('notes_label')}</FormLabel>
                                <FormControl>
                                    <Textarea
                                    placeholder={t('notes_placeholder')}
                                    className="resize-none"
                                    {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {t('book_now_button')}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
        <AddVehicleDialog 
            isOpen={isAddVehicleDialogOpen}
            onOpenChange={setIsAddVehicleDialogOpen}
            onAddVehicle={handleAddVehicle}
        />
        </>
    )
}
