
"use client";

import { useForm } from "react-hook-form";
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

const ProfileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email(),
});

// Mock user data to simulate a logged-in user.
// In a real app, this would come from a context or session.
const mockUser = {
  name: "Karim Ben Ahmed",
  email: "karim@example.com",
};

export default function ProfilePage() {
    const { t } = useTranslation();
    const { toast } = useToast();
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState(true);

    const form = useForm<z.infer<typeof ProfileFormSchema>>({
        resolver: zodResolver(ProfileFormSchema),
        defaultValues: {
            name: "", 
            email: "",
        },
    });

    useEffect(() => {
        // Simulate fetching user data and then populating the form.
        setTimeout(() => {
            form.reset(mockUser);
            // On load, check localStorage for a saved avatar
            const savedAvatar = localStorage.getItem('userAvatar');
            if (savedAvatar) {
                setAvatarPreview(savedAvatar);
            }
            setIsLoading(false);
        }, 1000);
    }, [form]);

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
            const reader = new FileReader();
            reader.onloadend = () => {
                const dataUrl = reader.result as string;
                setAvatarPreview(dataUrl);
                localStorage.setItem('userAvatar', dataUrl);
            };
            reader.readAsDataURL(file);
        }
    }, []);

    const handleButtonClick = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const handleDeleteAvatar = useCallback(() => {
        setAvatarPreview(null);
        localStorage.removeItem('userAvatar');
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }, []);

    const onSubmit = useCallback((data: z.infer<typeof ProfileFormSchema>) => {
        console.log(data);
        if (data.email !== mockUser.email) {
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
    }, [t, toast]);

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
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                    accept="image/*"
                                />
                                <Button type="button" variant="outline" onClick={handleButtonClick}>{t('change_photo_button')}</Button>
                                {avatarPreview && (
                                    <Button type="button" variant="destructive" onClick={handleDeleteAvatar}>{t('delete_photo_button')}</Button>
                                )}
                            </div>
                             <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('contact_form_name')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Your Name" {...field} />
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
                                            <Input placeholder="name@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">{t('profile_save_button')}</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </main>
    );
}
