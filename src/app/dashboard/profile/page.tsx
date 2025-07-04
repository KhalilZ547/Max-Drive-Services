
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

const ProfileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email(),
});

export default function ProfilePage() {
    const { t } = useTranslation();
    const { toast } = useToast();

    // Mock user data
    const user = {
        name: "John Doe",
        email: "john.doe@example.com",
        avatar: "JD"
    };

    const form = useForm<z.infer<typeof ProfileFormSchema>>({
        resolver: zodResolver(ProfileFormSchema),
        defaultValues: {
            name: user.name,
            email: user.email,
        },
    });

    function onSubmit(data: z.infer<typeof ProfileFormSchema>) {
        console.log(data);
        toast({
            title: t('profile_update_success_title'),
            description: t('profile_update_success_desc'),
        });
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
                                    <AvatarImage src={`https://placehold.co/80x80.png?text=${user.avatar}`} />
                                    <AvatarFallback>{user.avatar}</AvatarFallback>
                                </Avatar>
                                <Button type="button" variant="outline">Change Photo</Button>
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
                                            <Input placeholder="name@example.com" {...field} disabled />
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
