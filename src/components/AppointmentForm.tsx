
"use client";

import { useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { sendEmail } from "@/services/email";

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

    const AppointmentFormSchema = useMemo(() => z.object({
        serviceId: z.string({
            required_error: "Please select a service.",
        }),
        vehicle: z.string({ required_error: "Please enter your vehicle details." }).min(3, { message: "Please enter at least 3 characters." }),
        appointmentDate: z.date({
            required_error: "A date for the appointment is required.",
        }),
        notes: z.string().optional(),
        otherService: z.string().optional(),
        }).refine((data) => {
            if (data.serviceId === 'other') {
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
            serviceId: initialService || undefined,
            vehicle: "",
            notes: "",
            otherService: "",
        },
    });

    useEffect(() => {
        if (initialService) {
            form.setValue('serviceId', initialService);
        }
    }, [initialService, form]);


    const selectedService = form.watch("serviceId");

    async function onSubmit(data: z.infer<typeof AppointmentFormSchema>) {
        const serviceName = data.serviceId === 'other' 
            ? data.otherService
            : t(services.find(s => s.id === data.serviceId)?.key as any);
        
        const formattedDate = format(data.appointmentDate, "PPP");
        const adminEmail = 'contact@maxdrive.com';
        // This should be replaced with the actual logged-in user's email in a real app
        const userEmail = 'john.doe@example.com'; 

        // Email to Admin
        await sendEmail({
            to: adminEmail,
            subject: `New Appointment Booking: ${serviceName} for ${data.vehicle}`,
            html: `
                <h1>New Appointment Request</h1>
                <p>A new appointment has been booked through the website.</p>
                <ul>
                    <li><strong>Service:</strong> ${serviceName}</li>
                    <li><strong>Vehicle:</strong> ${data.vehicle}</li>
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
                    <li><strong>Service:</strong> ${serviceName}</li>
                    <li><strong>Vehicle:</strong> ${data.vehicle}</li>
                    <li><strong>Date:</strong> ${formattedDate}</li>
                </ul>
                <p>We look forward to seeing you!</p>
            `
        });


        toast({
            title: t('appointment_booked_title'),
            description: `${t('appointment_booked_desc')} ${serviceName} ${t('on')} ${formattedDate}.`,
        });
        form.reset();
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
                            name="serviceId"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>{t('service_label')}</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('select_service_placeholder')} />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    {services.map(service => (
                                        <SelectItem key={service.id} value={service.id}>
                                            {t(service.key as any)}
                                        </SelectItem>
                                    ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                        />

                        {selectedService === 'other' && (
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
                            name="vehicle"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>{t('vehicle_label')}</FormLabel>
                                <FormControl>
                                    <Input placeholder={t('vehicle_placeholder')} {...field} />
                                </FormControl>
                                <FormDescription>{t('vehicle_input_description')}</FormDescription>
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
                        <Button type="submit">{t('book_now_button')}</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
