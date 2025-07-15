
"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSearchParams } from 'next/navigation';

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
import { UploadCloud, File as FileIcon, X, Loader2 } from "lucide-react";
import { useTuningRequests } from "@/hooks/use-tuning-requests";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { vehicleData } from "@/lib/mock-data";
import { Checkbox } from "./ui/checkbox";

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
    const searchParams = useSearchParams();
    const initialService = searchParams.get('service');

    const EcuTuningFormSchema = useMemo(() => z.object({
        name: z.string().min(2, { message: t('contact_form_name') + " is required." }),
        email: z.string().email(),
        
        vehicleMake: z.string({ required_error: "Please select a vehicle make." }),
        vehicleModel: z.string().optional(),
        vehicleYear: z.string().optional(),
        vehicleEngine: z.string().optional(),
        otherVehicle: z.string().optional(),

        serviceIds: z.array(z.string()).refine((value) => value.some((item) => item), {
            message: "You have to select at least one service.",
        }),
        fileType: z.enum(["eeprom", "flash", "full_backup"], { required_error: "You need to select a file type." }),
        file: z.any().refine(file => file?.length == 1, "ECU file is required."),
        notes: z.string().optional(),
    }).refine(data => {
        if (data.vehicleMake === 'Other') {
            return data.otherVehicle && data.otherVehicle.length >= 5;
        }
        return data.vehicleModel && data.vehicleYear && data.vehicleEngine;
    }, {
        message: "Please complete all vehicle fields.",
        path: ['otherVehicle'], 
    }), [t]);

    const form = useForm<z.infer<typeof EcuTuningFormSchema>>({
        resolver: zodResolver(EcuTuningFormSchema),
        defaultValues: {
            fileType: "flash",
            serviceIds: initialService ? [initialService] : [],
        },
    });

    useEffect(() => {
        if (initialService) {
            form.setValue('serviceIds', [initialService]);
        }
    }, [initialService, form]);


    const watchedMake = form.watch("vehicleMake");
    const watchedModel = form.watch("vehicleModel");
    const watchedYear = form.watch("vehicleYear");

    const models = useMemo(() => {
        return watchedMake && vehicleData[watchedMake] ? vehicleData[watchedMake].models : [];
    }, [watchedMake]);

    const years = useMemo(() => {
        return watchedMake && watchedModel && vehicleData[watchedMake]
            ? vehicleData[watchedMake].years[watchedModel] ?? []
            : [];
    }, [watchedMake, watchedModel]);

    const engines = useMemo(() => {
        return watchedMake && watchedModel && watchedYear && vehicleData[watchedMake]
            ? vehicleData[watchedMake].engines[watchedModel]?.[watchedYear] ?? []
            : [];
    }, [watchedMake, watchedModel, watchedYear]);
    
    useEffect(() => { form.resetField("vehicleModel") }, [watchedMake, form]);
    useEffect(() => { form.resetField("vehicleYear") }, [watchedModel, form]);
    useEffect(() => { form.resetField("vehicleEngine") }, [watchedYear, form]);

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
        await new Promise(resolve => setTimeout(resolve, 1500));

        const vehicleDetails = data.vehicleMake === 'Other'
            ? data.otherVehicle!
            : `${data.vehicleMake} ${data.vehicleModel} ${data.vehicleYear} ${data.vehicleEngine}`;
        
        const serviceNames = data.serviceIds.map(id => t(ecuServices.find(s => s.id === id)!.key as any)).join(', ');
        
        addRequest({ 
            name: data.name,
            email: data.email,
            vehicle: vehicleDetails,
            service: serviceNames,
            fileType: data.fileType,
            notes: data.notes
        });
        
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
                        
                        <Card className="p-4 bg-muted/30">
                            <CardTitle as="h4" className="text-lg mb-4">Vehicle Details</CardTitle>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField control={form.control} name="vehicleMake" render={({ field }) => (
                                    <FormItem className="md:col-span-2"><FormLabel>Make</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select Make" /></SelectTrigger></FormControl>
                                        <SelectContent>{Object.keys(vehicleData).map(make => <SelectItem key={make} value={make}>{make}</SelectItem>)}</SelectContent>
                                    </Select><FormMessage /></FormItem>
                                )}/>
                                
                                {watchedMake === 'Other' ? (
                                     <FormField control={form.control} name="otherVehicle" render={({ field }) => (
                                        <FormItem className="md:col-span-2">
                                            <FormLabel>Vehicle Details</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g., Lancia Delta Integrale 1992 2.0L 16V" {...field} />
                                            </FormControl>
                                            <FormDescription>Please provide Make, Model, Year, and Engine.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}/>
                                ) : (
                                    <>
                                        <FormField control={form.control} name="vehicleModel" render={({ field }) => (
                                            <FormItem><FormLabel>Model</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value} disabled={!watchedMake}><FormControl><SelectTrigger><SelectValue placeholder="Select Model" /></SelectTrigger></FormControl>
                                                <SelectContent>{models.map(model => <SelectItem key={model} value={model}>{model}</SelectItem>)}</SelectContent>
                                            </Select><FormMessage /></FormItem>
                                        )}/>
                                        <FormField control={form.control} name="vehicleYear" render={({ field }) => (
                                            <FormItem><FormLabel>Year</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value} disabled={!watchedModel}><FormControl><SelectTrigger><SelectValue placeholder="Select Year" /></SelectTrigger></FormControl>
                                                <SelectContent>{years.map(year => <SelectItem key={year} value={year}>{year}</SelectItem>)}</SelectContent>
                                            </Select><FormMessage /></FormItem>
                                        )}/>
                                        <FormField control={form.control} name="vehicleEngine" render={({ field }) => (
                                            <FormItem className="md:col-span-2"><FormLabel>Engine</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value} disabled={!watchedYear}><FormControl><SelectTrigger><SelectValue placeholder="Select Engine" /></SelectTrigger></FormControl>
                                                <SelectContent>{engines.map(engine => <SelectItem key={engine} value={engine}>{engine}</SelectItem>)}</SelectContent>
                                            </Select><FormMessage /></FormItem>
                                        )}/>
                                    </>
                                )}
                            </div>
                        </Card>

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
                                    {ecuServices.map((item) => (
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
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="fileType"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                <FormLabel>File Type</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        className="flex flex-col space-y-1"
                                    >
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                            <RadioGroupItem value="flash" />
                                            </FormControl>
                                            <FormLabel className="font-normal">Flash File</FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                            <RadioGroupItem value="eeprom" />
                                            </FormControl>
                                            <FormLabel className="font-normal">EEPROM File</FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                            <RadioGroupItem value="full_backup" />
                                            </FormControl>
                                            <FormLabel className="font-normal">Full Backup (.rar/.zip)</FormLabel>
                                        </FormItem>
                                    </RadioGroup>
                                </FormControl>
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
                                                accept=".bin,.zip,.rar,.ori"
                                            />
                                            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                                <UploadCloud className="h-10 w-10"/>
                                                <span>Click to upload or drag and drop</span>
                                                <span className="text-xs">.bin, .ori, .zip, .rar files</span>
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
                                    <FileIcon className="h-5 w-5 text-primary"/>
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
