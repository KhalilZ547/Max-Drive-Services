
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
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { sendEmail } from "@/services/email";

export function SignupForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const { toast } = useToast();

  const FormSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email." }),
    password: z.string().min(8, { message: "Password must be at least 8 characters." }),
    confirmPassword: z.string(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    // In a real app, generate a unique verification link.
    const verificationLink = `${window.location.origin}/login?verified=true`; // Mock link

    await sendEmail({
      to: data.email,
      subject: "Welcome to Max-Drive-Services! Please Verify Your Email",
      html: `
        <h1>Welcome!</h1>
        <p>Thank you for signing up. Please click the link below to verify your email address and activate your account:</p>
        <a href="${verificationLink}" target="_blank" style="display:inline-block;padding:10px 20px;background-color:#2563eb;color:white;text-decoration:none;border-radius:5px;">Verify Email</a>
        <p>If you did not sign up for this account, you can ignore this email.</p>
      `
    });
    
    toast({
        title: t('signup_confirmation_title'),
        description: t('signup_confirmation_desc'),
    });
    router.push("/login");
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{t('signup_title')}</CardTitle>
        <CardDescription>{t('signup_subtitle')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('password_label')}</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('confirm_password_label')}</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">{t('nav_signup')}</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
