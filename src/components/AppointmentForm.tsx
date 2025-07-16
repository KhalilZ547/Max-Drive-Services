
"use client";

import { useMemo, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useSearchParams } from 'next/navigation';

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
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { sendEmail } from "@/services/email";
import { addVehicle } from "@/app/dashboard/vehicles/actions";

const services = [
    { id: 'oil-change', key: 'service_oil_change_title'},
    { id: 'brake-repair', key: 'service_brake_repair_title' },
    { id: 'engine-diagnostic', key: 'service_engine_diagnostic_title' },
    { id: 'ecu-solutions', key: 'service_ecu_solutions_title' },
    { id: 'other', key: 'service_other_title' },
];

export function AppointmentForm() {
    const { t } = useTranslation();
    const { toast } = useToast();
    const searchParams = useSearchParams();
    const initialService = searchParams.get('service');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const AppointmentFormSchema = useMemo(() => z.object({
        serviceIds: z.array(z.string()).refine((value) => value.some((item) => item), {
            message: "You have to select at least one service.",
        }),
        vehicleMake: z.string().min(2, "Make is required"),
        vehicleModel: z.string().min(1, "Model is required"),
        vehicleYear: z.coerce.number().min(1900).max(new Date().getFullYear() + 1),
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
            vehicleMake: "",
            vehicleModel: "",
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

    async function onSubmit(data: z.infer<typeof AppointmentFormSchema>) {
        setIsSubmitting(true);
        const serviceNames = data.serviceIds.map(id => {
            if (id === 'other') return data.otherService;
            return t(services.find(s => s.id === id)?.key as any);
        }).join(', ');
        
        const vehicleDetails = {
            make: data.vehicleMake,
            model: data.vehicleModel,
            year: data.vehicleYear,
        };
        
        // Add vehicle to user's profile
        await addVehicle(vehicleDetails);
        
        const formattedDate = format(data.appointmentDate, "PPP");
        const adminEmail = 'contact@maxdrive.com';
        // This should be replaced with the actual logged-in user's email in a real app
        const userEmail = 'john.doe@example.com'; 

        // Email to Admin
        await sendEmail({
            to: adminEmail,
            subject: `New Appointment Booking: ${serviceNames} for ${data.vehicleMake} ${data.vehicleModel}`,
            html: `
                <h1>New Appointment Request</h1>
                <p>A new appointment has been booked through the website.</p>
                <ul>
                    <li><strong>Service(s):</strong> ${serviceNames}</li>
                    <li><strong>Vehicle:</strong> ${data.vehicleMake} ${data.vehicleModel} ${data.vehicleYear}</li>
                    <li><strong>Requested Date:</strong> ${formattedDate}</li>
                    <li><strong>Notes:</strong> ${data.notes || 'None'}</li>
                </ul>
            `
        });

        // Confirmation Email to User
        await sendEmail({
            to: userEmail,
            subject: `Your Appointment Confirmation with Max-Drive-Services`,
            html: `
                <h1>Appointment Confirmed!</h1>
                <p>Thank you for booking with Max-Drive-Services. Your appointment details are below:</p>
                <ul>
                    <li><strong>Service(s):</strong> ${serviceNames}</li>
                    <li><strong>Vehicle:</strong> ${data.vehicleMake} ${data.vehicleModel} ${data.vehicleYear}</li>
                    <li><strong>Date:</strong> ${formattedDate}</li>
                </ul>
                <p>We look forward to seeing you!</p>
            `
        });


        toast({
            title: t('appointment_booked_title'),
            description: `${t('appointment_booked_desc')} ${serviceNames} ${t('on')} ${formattedDate}.`,
        });
        form.reset({ serviceIds: [], vehicleMake: "", vehicleModel: "", vehicleYear: undefined, notes: "", otherService: "" });
        setIsSubmitting(false);
    }
    
    return (
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

                        <div className="space-y-4 rounded-lg border p-4">
                            <FormLabel>{t('vehicle_label')}</FormLabel>
                             <FormDescription>{t('vehicle_input_description')}</FormDescription>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                               <FormField control={form.control} name="vehicleMake" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('vehicle_make')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Toyota" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                 <FormField control={form.control} name="vehicleModel" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('vehicle_model')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Camry" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                 <FormField control={form.control} name="vehicleYear" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('vehicle_year')}</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="e.g., 2021" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                            </div>
                        </div>

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
    )
}
