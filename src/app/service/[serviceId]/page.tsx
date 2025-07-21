
'use client';

import { useMemo, useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import { useTranslation } from '@/hooks/use-translation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import type { TranslationKey } from '@/lib/translations';
import { getAllSettings } from '@/services/settings';
import { Skeleton } from '@/components/ui/skeleton';

const serviceData: Record<string, { titleKey: TranslationKey; detailKey: TranslationKey; imageSettingKey: string }> = {
  'oil-change': {
    titleKey: 'service_oil_change_title',
    detailKey: 'service_oil_change_detail',
    imageSettingKey: 'service_oil_change_image',
  },
  'brake-repair': {
    titleKey: 'service_brake_repair_title',
    detailKey: 'service_brake_repair_detail',
    imageSettingKey: 'service_brake_repair_image',
  },
  'engine-diagnostic': {
    titleKey: 'service_engine_diagnostic_title',
    detailKey: 'service_engine_diagnostic_detail',
    imageSettingKey: 'service_engine_diagnostic_image',
  },
  'ecu-solutions': {
    titleKey: 'service_ecu_solutions_title',
    detailKey: 'service_ecu_solutions_detail',
    imageSettingKey: 'service_ecu_solutions_image',
  },
};

export default function ServiceDetailPage() {
  const params = useParams();
  const { t } = useTranslation();
  const [settings, setSettings] = useState<Record<string, string> | null>(null);
  const serviceId = params.serviceId as string;

  const service = useMemo(() => serviceData[serviceId], [serviceId]);

  useEffect(() => {
    async function fetchSettings() {
      const fetchedSettings = await getAllSettings();
      setSettings(fetchedSettings);
    }
    fetchSettings();
  }, []);

  if (!service) {
    notFound();
  }
  
  const serviceImage = settings ? (settings[service.imageSettingKey] || 'https://placehold.co/1200x600.png') : null;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 py-12 md:py-20">
        <div className="container">
          <Card>
            <CardHeader>
              <div className="relative h-64 w-full mb-6 rounded-lg overflow-hidden">
                {serviceImage ? (
                  <Image
                    src={serviceImage}
                    alt={t(service.titleKey)}
                    layout="fill"
                    objectFit="cover"
                  />
                ) : (
                  <Skeleton className="h-full w-full" />
                )}
              </div>
              <CardTitle className="text-4xl text-primary">{t(service.titleKey)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert max-w-none text-foreground/80 leading-relaxed">
                {t(service.detailKey).split('\\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
              <div className="mt-8 flex gap-4">
                <Button asChild size="lg">
                  <Link href={`/dashboard/appointment?service=${serviceId}`}>{t('book_now_button')}</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                   <Link href="/#services">{t('back_to_services')}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      {settings ? <Footer settings={settings} /> : <div className="h-24 border-t"></div>}
    </div>
  );
}
