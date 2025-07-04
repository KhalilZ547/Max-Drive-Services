"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

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

const services = [
    { id: 'oil_change', key: 'service_oil_change_title'},
    { id: 'brake_repair', key: 'service_brake_repair_title' },
    { id: 'engine_diagnostic', key: 'service_engine_diagnostic_title' },
    { id: 'ecu_solutions', key: 'service_ecu_solutions_title' },
    { id: 'other', key: 'service_other_title' },
];

export function AppointmentForm() {
    const { t } = useTranslation();
    const { toast } = useToast();

    const AppointmentFormSchema = React.useMemo(() => z.object({
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
            vehicle: "",
            notes: "",
            otherService: "",
        },
    });

    const selectedService = form.watch("serviceId");

    function onSubmit(data: z.infer<typeof AppointmentFormSchema>) {
        console.log(data);
        const serviceName = data.serviceId === 'other' 
            ? data.otherService
            : t(services.find(s => s.id === data.serviceId)?.key as any);

        toast({
            title: t('appointment_booked_title'),
            description: `${t('appointment_booked_desc')} ${serviceName} ${t('on')} ${format(data.appointmentDate, "PPP")}.`,
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
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
