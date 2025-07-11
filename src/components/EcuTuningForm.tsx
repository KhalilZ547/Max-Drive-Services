
"use client";

import { useMemo, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import { useToast } from "@/hooks/use-toast";
import { UploadCloud, File, X, Loader2 } from "lucide-react";
import { useTuningRequests } from "@/hooks/use-tuning-requests";

const ecuServices = [
    { id: 'dtc_off', key: 'ecu_dtc_off_title' },
    { id: 'egr_off', key: 'ecu_egr_off_title' },
    { id: 'adblue_off', key: 'ecu_adblue_off_title' },
    { id: 'performance_tuning', key: 'ecu_performance_tuning_title' },
    { id: 'other', key: 'service_other_title' },
];

export function EcuTuningForm() {
    const { t } = useTranslation();
    const { toast } = useToast();
    const { addRequest } = useTuningRequests();
    const [fileName, setFileName] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const EcuTuningFormSchema = useMemo(() => z.object({
        name: z.string().min(2, { message: t('contact_form_name') + " is required." }),
        email: z.string().email(),
        vehicle: z.string().min(3, { message: "Vehicle details are required." }),
        serviceId: z.string({ required_error: "Please select a service." }),
        file: z.any().refine(file => file?.length == 1, "ECU file is required."),
        notes: z.string().optional(),
    }), [t]);

    const form = useForm<z.infer<typeof EcuTuningFormSchema>>({
        resolver: zodResolver(EcuTuningFormSchema),
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFileName(file.name);
            form.setValue("file", event.target.files);
        }
    };

    const handleRemoveFile = () => {
        setFileName(null);
        form.setValue("file", null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    async function onSubmit(data: z.infer<typeof EcuTuningFormSchema>) {
        setIsSubmitting(true);
        // Simulate async operation
        await new Promise(resolve => setTimeout(resolve, 1500));

        const serviceName = t(ecuServices.find(s => s.id === data.serviceId)!.key as any);
        addRequest({ ...data, service: serviceName });
        
        toast({
            title: "Request Submitted!",
            description: "We've received your tuning request. We will review your file and email you a quote shortly.",
        });
        form.reset();
        setFileName(null);
        setIsSubmitting(false);
    }
    
    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Submit Your ECU File</CardTitle>
                <CardDescription>Fill out the form to get a quote for your ECU modification. We'll get back to you with a price and a PayPal payment link.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('contact_form_name')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Your full name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('email_label')}</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="name@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        
                        <FormField
                            control={form.control}
                            name="vehicle"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Vehicle Details</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Audi A3 2018 2.0 TDI" {...field} />
                                    </FormControl>
                                    <FormDescription>Make, model, year, and engine.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

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
                                        {ecuServices.map(service => (
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

                        <FormField
                            control={form.control}
                            name="file"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>ECU File Upload</FormLabel>
                                    <FormControl>
                                        <div 
                                            className="relative border-2 border-dashed border-muted-foreground/50 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <input 
                                                type="file" 
                                                ref={fileInputRef} 
                                                className="hidden"
                                                onChange={handleFileChange}
                                                accept=".bin"
                                            />
                                            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                                <UploadCloud className="h-10 w-10"/>
                                                <span>Click to upload or drag and drop</span>
                                                <span className="text-xs">Binary file (.bin)</span>
                                            </div>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {fileName && (
                            <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-3">
                                <div className="flex items-center gap-2">
                                    <File className="h-5 w-5 text-primary"/>
                                    <span className="text-sm font-medium">{fileName}</span>
                                </div>
                                <Button type="button" variant="ghost" size="icon" onClick={handleRemoveFile}>
                                    <X className="h-4 w-4"/>
                                </Button>
                            </div>
                        )}
                        
                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('notes_label')}</FormLabel>
                                    <FormControl>
                                        <Textarea
                                        placeholder="Provide any additional details about your request..."
                                        className="resize-none"
                                        {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                "Submit Tuning Request"
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
