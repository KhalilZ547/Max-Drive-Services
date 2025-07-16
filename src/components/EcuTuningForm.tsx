
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
import { UploadCloud, File as FileIcon, X, Loader2, AlertCircle } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { vehicleData } from "@/lib/mock-data";
import { Checkbox } from "./ui/checkbox";
import { addTuningRequest } from "@/app/admin/tuning/actions";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

const ecuServices = [
    { id: 'dtc_off', key: 'ecu_dtc_off_title' },
    { id: 'egr_off', key: 'ecu_egr_off_title' },
    { id: 'adblue_off', key: 'ecu_adblue_off_title' },
    { id: 'performance_tuning', key: 'ecu_performance_tuning_title' },
    { id: 'flaps_off', key: 'ecu_flaps_off_title' },
    { id: 'nox_off', key: 'ecu_nox_off_title' },
    { id: 'tva_off', key: 'ecu_tva_off_title' },
    { id: 'lambda_off', key: 'ecu_lambda_off_title' },
    { id: 'radio_pin', key: 'ecu_radio_pin_title' },
    { id: 'other', key: 'service_other_title' },
];

const OTHER_VALUE = 'other_manual_input';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB
const ALLOWED_FILE_TYPES = ['.bin', '.zip', '.rar', '.ori'];


export function EcuTuningForm() {
    const { t } = useTranslation();
    const { toast } = useToast();
    const [fileName, setFileName] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const searchParams = useSearchParams();
    const initialService = searchParams.get('service');
    
    // State for dynamic placeholders
    const [otherServicePlaceholder, setOtherServicePlaceholder] = useState('e.g., Hardcut Limiter');
    const [otherMakePlaceholder, setOtherMakePlaceholder] = useState('e.g., Lancia');
    const [otherModelPlaceholder, setOtherModelPlaceholder] = useState('e.g., Delta Integrale');
    const [otherYearPlaceholder, setOtherYearPlaceholder] = useState('e.g., 1992');
    const [otherEnginePlaceholder, setOtherEnginePlaceholder] = useState('e.g., 2.0L 16V Turbo');
    const [radioSerialPlaceholder, setRadioSerialPlaceholder] = useState('e.g., VWZ1Z2A1234567');

    useEffect(() => {
        const otherServiceExamples = ['e.g., Hardcut Limiter', 'e.g., Pop & Bang', 'e.g., Launch Control', 'e.g., VMAX Off'];
        setOtherServicePlaceholder(otherServiceExamples[Math.floor(Math.random() * otherServiceExamples.length)]);
        
        const otherMakeExamples = ['e.g., Lancia', 'e.g., Seat', 'e.g., Alfa Romeo'];
        setOtherMakePlaceholder(otherMakeExamples[Math.floor(Math.random() * otherMakeExamples.length)]);
        
        const otherModelExamples = ['e.g., Delta Integrale', 'e.g., Leon Cupra', 'e.g., Giulia QV'];
        setOtherModelPlaceholder(otherModelExamples[Math.floor(Math.random() * otherModelExamples.length)]);

        const otherYearExamples = ['e.g., 1992', 'e.g., 2018', 'e.g., 2023'];
        setOtherYearPlaceholder(otherYearExamples[Math.floor(Math.random() * otherYearExamples.length)]);

        const otherEngineExamples = ['e.g., 2.0L 16V Turbo', 'e.g., 1.9 TDI PD130', 'e.g., 2.9L V6 Bi-Turbo'];
        setOtherEnginePlaceholder(otherEngineExamples[Math.floor(Math.random() * otherEngineExamples.length)]);

        const radioSerialExamples = ['e.g., VWZ1Z2A1234567', 'e.g., AUZ1Z3B1234567', 'e.g., BP8273A1234567'];
        setRadioSerialPlaceholder(radioSerialExamples[Math.floor(Math.random() * radioSerialExamples.length)]);
    }, []);

    const EcuTuningFormSchema = useMemo(() => z.object({
        name: z.string().min(2, { message: t('contact_form_name') + " is required." }),
        email: z.string().email(),
        
        vehicleMake: z.string({ required_error: "Please select a vehicle make." }),
        otherVehicleMake: z.string().optional(),
        vehicleModel: z.string().optional(),
        otherVehicleModel: z.string().optional(),
        vehicleYear: z.string().optional(),
        otherVehicleYear: z.string().optional(),
        vehicleEngine: z.string().optional(),
        otherVehicleEngine: z.string().optional(),
        
        serviceIds: z.array(z.string()).refine((value) => value.some((item) => item), {
            message: "You have to select at least one service.",
        }),
        otherServiceDescription: z.string().optional(),
        radioSerialNumber: z.string().optional(),
        fileType: z.enum(["eeprom", "flash", "full_backup"], { required_error: "You need to select a file type." }).optional(),
        file: z
            .custom<FileList>()
            .optional(),
        notes: z.string().optional(),
    }).superRefine((data, ctx) => {
        if (data.vehicleMake === OTHER_VALUE && (!data.otherVehicleMake || data.otherVehicleMake.trim().length < 2)) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please specify the vehicle make (min 2 chars).", path: ["otherVehicleMake"] });
        }
        if (data.vehicleModel === OTHER_VALUE && (!data.otherVehicleModel || data.otherVehicleModel.trim().length < 2)) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please specify the vehicle model (min 2 chars).", path: ["otherVehicleModel"] });
        }
        if (data.vehicleYear === OTHER_VALUE && (!data.otherVehicleYear || !/^\d{4}$/.test(data.otherVehicleYear))) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please specify a valid 4-digit year.", path: ["otherVehicleYear"] });
        }
        if (data.vehicleEngine === OTHER_VALUE && (!data.otherVehicleEngine || data.otherVehicleEngine.trim().length < 2)) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please specify the vehicle engine (min 2 chars).", path: ["otherVehicleEngine"] });
        }

        const isOnlyRadioPin = data.serviceIds.length === 1 && data.serviceIds[0] === 'radio_pin';
        if (isOnlyRadioPin) {
            if (!data.radioSerialNumber || data.radioSerialNumber.trim().length < 5) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Radio serial number is required (min 5 chars).", path: ["radioSerialNumber"] });
            }
        } else {
            const files = data.file;
            if (!files || files.length === 0) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, message: "ECU file is required for this service.", path: ["file"] });
            } else {
                if(files[0].size > MAX_FILE_SIZE) {
                    ctx.addIssue({ code: z.ZodIssueCode.custom, message: `File size should be less than 50 MB.`, path: ["file"] });
                }
                if(!ALLOWED_FILE_TYPES.some(type => files[0].name.endsWith(type))) {
                     ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Only .bin, .zip, .rar, .ori files are allowed.`, path: ["file"] });
                }
            }
        }
        
        if (data.serviceIds.includes('other') && (!data.otherServiceDescription || data.otherServiceDescription.trim().length < 3)) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: t('other_service_error'), path: ["otherServiceDescription"] });
        }

    }), [t]);

    const form = useForm<z.infer<typeof EcuTuningFormSchema>>({
        resolver: zodResolver(EcuTuningFormSchema),
        defaultValues: {
            name: "",
            email: "",
            otherVehicleMake: "",
            otherVehicleModel: "",
            otherVehicleYear: "",
            otherVehicleEngine: "",
            notes: "",
            fileType: "flash",
            serviceIds: initialService ? [initialService] : [],
            radioSerialNumber: "",
            otherServiceDescription: "",
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
    const watchedServices = form.watch("serviceIds");
    const isOtherServiceSelected = useMemo(() => watchedServices?.includes('other'), [watchedServices]);
    const isOnlyRadioPinSelected = useMemo(() => watchedServices?.length === 1 && watchedServices[0] === 'radio_pin', [watchedServices]);

    const models = useMemo(() => {
        return watchedMake && watchedMake !== OTHER_VALUE && vehicleData[watchedMake] ? vehicleData[watchedMake].models : [];
    }, [watchedMake]);

    const years = useMemo(() => {
        return watchedMake && watchedMake !== OTHER_VALUE && watchedModel && watchedModel !== OTHER_VALUE && vehicleData[watchedMake]
            ? vehicleData[watchedMake].years[watchedModel] ?? []
            : [];
    }, [watchedMake, watchedModel]);

    const engines = useMemo(() => {
        return watchedMake && watchedMake !== OTHER_VALUE && watchedModel && watchedModel !== OTHER_VALUE && watchedYear && watchedYear !== OTHER_VALUE && vehicleData[watchedMake]
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
            form.setValue("file", event.target.files as FileList);
            form.trigger("file");
        }
    };

    const handleRemoveFile = () => {
        setFileName(null);
        form.setValue("file", null as any, { shouldValidate: true });
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    async function onSubmit(data: z.infer<typeof EcuTuningFormSchema>) {
        setIsSubmitting(true);
        
        const make = data.vehicleMake === OTHER_VALUE ? data.otherVehicleMake : data.vehicleMake;
        const model = data.vehicleModel === OTHER_VALUE ? data.otherVehicleModel : data.vehicleModel;
        const year = data.vehicleYear === OTHER_VALUE ? data.otherVehicleYear : data.vehicleYear;
        const engine = data.vehicleEngine === OTHER_VALUE ? data.otherVehicleEngine : data.vehicleEngine;
        const vehicleDetails = [make, model, year, engine].filter(Boolean).join(' ');
        
        let serviceNames = data.serviceIds.map(id => {
            if (id === 'other') return data.otherServiceDescription;
            return t(ecuServices.find(s => s.id === id)!.key as any)
        }).join(', ');
        
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('vehicle', vehicleDetails);
        formData.append('notes', data.notes || '');

        if (isOnlyRadioPinSelected) {
            formData.append('service', `${serviceNames} (Free)`);
            formData.append('radioSerialNumber', data.radioSerialNumber!);
        } else {
            formData.append('service', serviceNames);
            formData.append('fileType', data.fileType!);
            formData.append('file', data.file![0]);
        }

        const result = await addTuningRequest(formData);
        
        if(result.success) {
            toast({
                title: "Request Submitted!",
                description: "We've received your request. We will review it and get back to you shortly.",
            });
            form.reset({
                name: '',
                email: '',
                vehicleMake: undefined,
                otherVehicleMake: '',
                vehicleModel: undefined,
                otherVehicleModel: '',
                vehicleYear: undefined,
                otherVehicleYear: '',
                vehicleEngine: undefined,
                otherVehicleEngine: '',
                serviceIds: [],
                fileType: "flash",
                file: undefined,
                notes: '',
                radioSerialNumber: '',
                otherServiceDescription: '',
            });
            handleRemoveFile();
        } else {
             toast({
                title: "Submission Failed",
                description: result.error,
                variant: "destructive"
            });
        }
        
        setIsSubmitting(false);
    }
    
    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Submit Your ECU Service Request</CardTitle>
                <CardDescription>Fill out the form to get a quote or your free radio pin. We'll get back to you shortly.</CardDescription>
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
                                        <SelectContent>{Object.keys(vehicleData).filter(m => m !== 'Other').map(make => <SelectItem key={make} value={make}>{make}</SelectItem>)}<SelectItem value={OTHER_VALUE}>Other</SelectItem></SelectContent>
                                    </Select><FormMessage /></FormItem>
                                )}/>
                                
                                {watchedMake === OTHER_VALUE && (
                                    <FormField control={form.control} name="otherVehicleMake" render={({ field }) => (
                                       <FormItem className="md:col-span-2">
                                           <FormLabel>Specify Make</FormLabel>
                                           <FormControl><Input placeholder={otherMakePlaceholder} {...field} /></FormControl>
                                           <FormMessage />
                                       </FormItem>
                                   )}/>
                                )}
                                
                                {watchedMake && (
                                <>
                                    <FormField control={form.control} name="vehicleModel" render={({ field }) => (
                                        <FormItem><FormLabel>Model</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value} disabled={watchedMake !== OTHER_VALUE && !models.length}><FormControl><SelectTrigger><SelectValue placeholder="Select Model" /></SelectTrigger></FormControl>
                                            <SelectContent>{models.map(model => <SelectItem key={model} value={model}>{model}</SelectItem>)}<SelectItem value={OTHER_VALUE}>Other</SelectItem></SelectContent>
                                        </Select><FormMessage /></FormItem>
                                    )}/>
                                    {watchedModel === OTHER_VALUE && (
                                        <FormField control={form.control} name="otherVehicleModel" render={({ field }) => (
                                           <FormItem>
                                               <FormLabel>Specify Model</FormLabel>
                                               <FormControl><Input placeholder={otherModelPlaceholder} {...field} /></FormControl>
                                               <FormMessage />
                                           </FormItem>
                                       )}/>
                                    )}

                                    <FormField control={form.control} name="vehicleYear" render={({ field }) => (
                                        <FormItem><FormLabel>Year</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value} disabled={watchedMake !== OTHER_VALUE && (!years.length || watchedModel === OTHER_VALUE)}><FormControl><SelectTrigger><SelectValue placeholder="Select Year" /></SelectTrigger></FormControl>
                                            <SelectContent>{years.map(year => <SelectItem key={year} value={year}>{year}</SelectItem>)}<SelectItem value={OTHER_VALUE}>Other</SelectItem></SelectContent>
                                        </Select><FormMessage /></FormItem>
                                    )}/>
                                    {watchedYear === OTHER_VALUE && (
                                        <FormField control={form.control} name="otherVehicleYear" render={({ field }) => (
                                           <FormItem>
                                               <FormLabel>Specify Year</FormLabel>
                                               <FormControl><Input placeholder={otherYearPlaceholder} {...field} /></FormControl>
                                               <FormMessage />
                                           </FormItem>
                                       )}/>
                                    )}

                                    <FormField control={form.control} name="vehicleEngine" render={({ field }) => (
                                        <FormItem className="md:col-span-2"><FormLabel>Engine</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value} disabled={watchedMake !== OTHER_VALUE && (!engines.length || watchedYear === OTHER_VALUE)}><FormControl><SelectTrigger><SelectValue placeholder="Select Engine" /></SelectTrigger></FormControl>
                                            <SelectContent>{engines.map(engine => <SelectItem key={engine} value={engine}>{engine}</SelectItem>)}<SelectItem value={OTHER_VALUE}>Other</SelectItem></SelectContent>
                                        </Select><FormMessage /></FormItem>
                                    )}/>
                                    {form.watch('vehicleEngine') === OTHER_VALUE && (
                                         <FormField control={form.control} name="otherVehicleEngine" render={({ field }) => (
                                            <FormItem className="md:col-span-2">
                                                <FormLabel>Specify Engine</FormLabel>
                                                <FormControl><Input placeholder={otherEnginePlaceholder} {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}/>
                                    )}
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
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
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
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {isOtherServiceSelected && (
                             <FormField
                                control={form.control}
                                name="otherServiceDescription"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('other_service_label')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={otherServicePlaceholder} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        {isOnlyRadioPinSelected ? (
                            <div className="space-y-4">
                                 <Alert>
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Free Service!</AlertTitle>
                                    <AlertDescription>
                                       Radio Pin service is free. Please enter your radio's serial number below. No file upload is needed.
                                    </AlertDescription>
                                </Alert>
                                <FormField
                                    control={form.control}
                                    name="radioSerialNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Radio Serial Number</FormLabel>
                                            <FormControl>
                                                <Input placeholder={radioSerialPlaceholder} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        ) : (
                            <>
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
                                    render={() => (
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
                                                        accept={ALLOWED_FILE_TYPES.join(',')}
                                                    />
                                                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                                        <UploadCloud className="h-10 w-10"/>
                                                        <span>Click to upload or drag and drop</span>
                                                        <span className="text-xs">{ALLOWED_FILE_TYPES.join(', ')} up to 50MB</span>
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
                            </>
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
                                "Submit Request"
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

    

    