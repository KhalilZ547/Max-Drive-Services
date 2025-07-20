
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
import { signupUser } from "@/services/auth";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export function SignupForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const FormSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email." }),
    password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsSubmitting(true);
    const result = await signupUser(data);
    
    if (result.success) {
      toast({
          title: t('signup_confirmation_title'),
          description: t('signup_confirmation_desc'),
      });
      router.push("/login");
    } else {
       toast({
          title: 'Signup Failed',
          description: result.error,
          variant: 'destructive',
      });
    }
    setIsSubmitting(false);
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{t('signup_title')}</CardTitle>
        <CardDescription>{t('signup_subtitle')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
             <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contact_form_name')}</FormLabel>
                  <FormControl>
                    <Input placeholder="Your full name" {...field} disabled={isSubmitting} />
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('nav_signup')}
            </Button>
          </form>
        </Form>
        <div className="mt-6 text-center text-sm">
          Already have an account?{' '}
          <Link href="/login" className="underline font-semibold text-primary">
            {t('nav_login')}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
