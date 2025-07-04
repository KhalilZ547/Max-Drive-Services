'use client';

import { useTranslation } from '@/hooks/use-translation';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Phone, Mail, MapPin } from 'lucide-react';

export function ContactSection() {
  const { t } = useTranslation();
  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">{t('contact_title')}</h2>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">{t('contact_subtitle')}</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Card>
            <CardHeader>
              <CardTitle>{t('contact_title')}</CardTitle>
              <CardDescription>{t('contact_subtitle')}</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('contact_form_name')}</Label>
                  <Input id="name" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t('contact_form_email')}</Label>
                  <Input id="email" type="email" placeholder="john@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">{t('contact_form_message')}</Label>
                  <Textarea id="message" placeholder={t('contact_form_message')} />
                </div>
                <Button type="submit" className="w-full">{t('contact_form_submit')}</Button>
              </form>
            </CardContent>
          </Card>
          <div className="space-y-8 flex flex-col justify-center">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Address</h3>
                <p className="text-muted-foreground">{t('contact_info_address')}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Phone</h3>
                <p className="text-muted-foreground">{t('contact_info_phone')}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Email</h3>
                <p className="text-muted-foreground">{t('contact_info_email')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
