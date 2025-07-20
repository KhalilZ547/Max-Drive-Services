
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { loginUser } from "@/services/auth";
import { Loader2 } from "lucide-react";

export function LoginForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const FormSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, "Password is required"),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsSubmitting(true);
    const callbackUrl = searchParams.get("callbackUrl");

    const result = await loginUser(data);

    if (result.success && result.user) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('userId', result.user.id);
        localStorage.setItem('userRole', result.user.role);
        // This triggers the event listener in AIChat
        window.dispatchEvent(new CustomEvent('authChange', { detail: { userId: result.user.id } }));
      }
      
      if (result.user.role === 'admin') {
         router.push(callbackUrl || "/admin/dashboard");
      } else {
         router.push(callbackUrl || "/dashboard");
      }
    } else {
      toast({
        title: "Login Failed",
        description: result.error,
        variant: "destructive"
      });
    }
    setIsSubmitting(false);
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{t('login_title')}</CardTitle>
        <CardDescription>{t('login_subtitle')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('password_label')}</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <div className="flex justify-end">
                     <Link href="/forgot-password" className={cn(buttonVariants({ variant: "link" }), "p-0 h-auto text-xs")}>
                        {t('forgot_password_link')}
                     </Link>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('nav_login')}
            </Button>
          </form>
        </Form>
        <div className="mt-6 text-center text-sm">
          {t('login_create_account_prompt')}{' '}
          <Link href="/signup" className="underline font-semibold text-primary">
            {t('nav_signup')}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
