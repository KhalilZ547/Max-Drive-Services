
'use client';

import { useTranslation } from '@/hooks/use-translation';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Phone, Mail, MapPin } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { useToast } from '@/hooks/use-toast';

const ContactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

export function ContactSection({ settings }: { settings: Record<string, string> }) {
  const { t } = useTranslation();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof ContactFormSchema>>({
    resolver: zodResolver(ContactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  function onSubmit(data: z.infer<typeof ContactFormSchema>) {
    console.log(data);
    toast({
      title: t('contact_form_success_title'),
      description: t('contact_form_success_desc'),
    });
    form.reset();
  }
  
  const address = t('contact_info_address');
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  const phone = settings?.contact_phone || t('contact_info_phone');
  const telLink = `tel:${phone.replace(/\s/g, '')}`;
  const email = settings?.contact_email || t('contact_info_email');
  const mailtoLink = `mailto:${email}`;

  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 font-headline uppercase tracking-wider">{t('contact_title')}</h2>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">{t('contact_subtitle')}</p>
        <div className="grid grid-cols-1 gap-12 max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>{t('contact_title')}</CardTitle>
              <CardDescription>{t('contact_subtitle')}</CardDescription>
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
                          <Input placeholder="Karim Ben Ahmed" {...field} />
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
                        <FormLabel>{t('contact_form_email')}</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="karim@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('contact_form_message')}</FormLabel>
                        <FormControl>
                          <Textarea placeholder={t('contact_form_message_placeholder')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">{t('contact_form_submit')}</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          <div className="flex flex-col md:flex-row justify-around gap-8">
            <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 group">
              <div className="bg-primary/10 p-3 rounded-full">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">Address</h3>
                <p className="text-muted-foreground">
                  {address}
                </p>
              </div>
            </a>
            <a href={telLink} className="flex items-start gap-4 group">
              <div className="bg-primary/10 p-3 rounded-full">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">Phone</h3>
                 <p className="text-muted-foreground">
                  {phone}
                </p>
              </div>
            </a>
            <a href={mailtoLink} className="flex items-start gap-4 group">
              <div className="bg-primary/10 p-3 rounded-full">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">Email</h3>
                 <p className="text-muted-foreground">
                  {email}
                </p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
