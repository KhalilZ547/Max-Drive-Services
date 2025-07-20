
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
import { useRouter, useSearchParams } from "next/navigation";
import { resetPassword } from "@/app/reset-password/actions";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const ResetPasswordSchema = z.object({
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export function ResetPasswordForm() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: z.infer<typeof ResetPasswordSchema>) {
    setIsSubmitting(true);
    const email = searchParams.get('email');

    if (!email) {
      toast({
        title: "Error",
        description: "Invalid or expired password reset link.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }
    
    const result = await resetPassword({ email, password: data.password });

    if (result.success) {
        toast({
          title: t('password_reset_success_title'),
          description: t('password_reset_success_desc'),
        });
        router.push("/login");
    } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
    }

    setIsSubmitting(false);
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{t('reset_password_title')}</CardTitle>
        <CardDescription>{t('reset_password_subtitle')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('new_password_label')}</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} disabled={isSubmitting}/>
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
                  <FormLabel>{t('confirm_new_password_label')}</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} disabled={isSubmitting}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                {t('reset_password_button')}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
