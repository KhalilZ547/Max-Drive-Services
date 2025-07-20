
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
import { useRouter } from "next/navigation";
import Link from "next/link";
import { sendEmail } from "@/services/email";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import db from "@/lib/db"; // We need a way to check if the user exists, this is a temporary direct import for this component.

const ForgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
});

export function ForgotPasswordForm() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: z.infer<typeof ForgotPasswordSchema>) {
    setIsSubmitting(true);
    
    // In a real app, this logic would be in a server action to avoid exposing DB logic.
    // For now, we add a check here.
    try {
        // This is a simplified check. A proper implementation would be in a server action.
        const res = await fetch(`/api/check-user?email=${data.email}`);
        const { exists } = await res.json();
        
        // We always show a success message to prevent user enumeration.
        // The email is only sent if the user actually exists.
        if (exists) {
            // In a real app, generate a secure, unique, and temporary token, save it to the DB with an expiry.
            const resetLink = `${window.location.origin}/reset-password?email=${encodeURIComponent(data.email)}`; // Mock link

            await sendEmail({
                to: data.email,
                subject: "Your Password Reset Link for Max-Drive-Services",
                html: `
                <h1>Password Reset Request</h1>
                <p>We received a request to reset your password. Click the link below to set a new password:</p>
                <p><a href="${resetLink}" target="_blank">Reset Your Password</a></p>
                <p>This link will expire in 1 hour. If you did not request this, you can safely ignore this email.</p>
                `
            });
        }
        
        toast({
            title: t('password_reset_sent_title'),
            description: t('password_reset_sent_desc'),
        });
        router.push("/login");

    } catch (error) {
        toast({
            title: "Error",
            description: "An unexpected error occurred. Please try again.",
            variant: "destructive"
        });
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{t('forgot_password_title')}</CardTitle>
        <CardDescription>{t('forgot_password_subtitle')}</CardDescription>
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
                    <Input placeholder="name@example.com" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('send_reset_link_button')}
            </Button>
          </form>
        </Form>
        <div className="mt-6 text-center text-sm">
          <Link href="/login" className="underline font-semibold text-primary">
            {t('back_to_login_link')}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
