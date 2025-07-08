
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
import { clientsData } from "@/lib/mock-data";
import { sendEmail } from "@/services/email";

const ForgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
});

export function ForgotPasswordForm() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: z.infer<typeof ForgotPasswordSchema>) {
    const adminEmail = 'admin@maxdrive.com';
    const isRegistered = clientsData.some(client => client.email.toLowerCase() === data.email.toLowerCase()) || data.email.toLowerCase() === adminEmail;

    if (isRegistered) {
      // In a real app, generate a secure, unique, and temporary code.
      const verificationCode = "123456"; // This is a mock code.
      
      await sendEmail({
        to: data.email,
        subject: "Your Password Reset Code for Max-Drive-Services",
        html: `
          <h1>Password Reset Request</h1>
          <p>We received a request to reset your password. Use the code below to complete the process:</p>
          <h2 style="text-align:center;letter-spacing:2px;font-size:2em;">${verificationCode}</h2>
          <p>This code will expire in 10 minutes. If you did not request this, you can safely ignore this email.</p>
        `
      });

      toast({
        title: t('password_reset_sent_title'),
        description: t('password_reset_sent_desc'),
      });
      router.push("/reset-password");
    } else {
      toast({
        title: t('email_not_found_title'),
        description: t('email_not_found_desc'),
        variant: "destructive"
      });
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
                    <Input placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">{t('send_reset_link_button')}</Button>
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
