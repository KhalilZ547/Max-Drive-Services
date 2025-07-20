
"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useRef, ChangeEvent, useCallback, useEffect } from "react";
import { ProfilePageSkeleton } from "@/components/ProfilePageSkeleton";
import { getClientProfile, updateClientProfile, deleteClientAvatar } from "./actions";
import type { Client } from "@/services/clients";
import { Loader2 } from "lucide-react";

const ProfileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email(),
  avatar: z.any().optional(), // For the file input
});


export default function ProfilePage() {
    const { t } = useTranslation();
    const { toast } = useToast();
    const [client, setClient] = useState<Client | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof ProfileFormSchema>>({
        resolver: zodResolver(ProfileFormSchema),
        defaultValues: {
            name: "", 
            email: "",
        },
    });

    const fetchProfile = useCallback(async () => {
        try {
            const clientData = await getClientProfile();
            if(clientData){
                setClient(clientData);
                form.reset({ name: clientData.name, email: clientData.email });
                setAvatarPreview(clientData.avatar_url);
            }
        } catch (error) {
            console.error("Failed to fetch profile", error);
            toast({ title: "Error", description: "Could not load your profile.", variant: "destructive"});
        } finally {
            setIsLoading(false);
        }
    }, [form, toast]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const watchedName = form.watch("name");
    
    const getAvatarFallback = useCallback((name: string | undefined): string => {
        if (!name) return "U";
        const nameParts = name.trim().split(" ").filter(Boolean);

        if (nameParts.length > 1) {
            return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
        } else if (nameParts.length === 1 && nameParts[0].length > 0) {
            return nameParts[0][0].toUpperCase();
        }
        return "U";
    }, []);

    const avatarFallback = getAvatarFallback(watchedName);

    const handleAvatarChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            form.setValue('avatar', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    }, [form]);

    const handleButtonClick = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const handleDeleteAvatar = useCallback(async () => {
        setIsSubmitting(true);
        const result = await deleteClientAvatar();
        if(result.success) {
            setAvatarPreview(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            form.setValue('avatar', null);
            toast({ title: "Avatar Removed", description: "Your profile picture has been removed." });
        } else {
            toast({ title: "Error", description: result.error, variant: "destructive" });
        }
        setIsSubmitting(false);
    }, [form, toast]);

    const onSubmit = useCallback(async (data: z.infer<typeof ProfileFormSchema>) => {
        setIsSubmitting(true);
        
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);
        if (data.avatar) {
            formData.append('avatar', data.avatar);
        }

        const result = await updateClientProfile(formData);
        
        if (result.success) {
            if (client?.email !== data.email) {
                 toast({
                    title: t('email_change_confirmation_title'),
                    description: t('email_change_confirmation_desc'),
                });
            } else {
                toast({
                    title: t('profile_update_success_title'),
                    description: t('profile_update_success_desc'),
                });
            }
            fetchProfile(); // Re-fetch to get the latest data, including new S3 URL
        } else {
            toast({ title: "Update Failed", description: result.error, variant: "destructive" });
        }
        
        setIsSubmitting(false);
    }, [client, fetchProfile, t, toast]);

    if (isLoading) {
        return <ProfilePageSkeleton />;
    }

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <Card>
                <CardHeader>
                    <CardTitle>{t('profile_page_title')}</CardTitle>
                    <CardDescription>{t('profile_page_description')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="flex items-center space-x-4">
                                <Avatar className="h-20 w-20">
                                    <AvatarImage src={avatarPreview || undefined} />
                                    <AvatarFallback>{avatarFallback}</AvatarFallback>
                                </Avatar>
                                <Controller
                                    name="avatar"
                                    control={form.control}
                                    render={() => (
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleAvatarChange}
                                            className="hidden"
                                            accept="image/*"
                                            disabled={isSubmitting}
                                        />
                                    )}
                                />
                                <Button type="button" variant="outline" onClick={handleButtonClick} disabled={isSubmitting}>
                                    {t('change_photo_button')}
                                </Button>
                                {avatarPreview && (
                                    <Button type="button" variant="destructive" onClick={handleDeleteAvatar} disabled={isSubmitting}>
                                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin"/> : t('delete_photo_button')}
                                    </Button>
                                )}
                            </div>
                             <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('contact_form_name')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Your Name" {...field} disabled={isSubmitting}/>
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
                                            <Input placeholder="name@example.com" {...field} disabled={isSubmitting}/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                {t('profile_save_button')}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </main>
    );
}
