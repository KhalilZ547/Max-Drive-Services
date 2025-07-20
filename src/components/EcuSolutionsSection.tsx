
'use client';

import { useMemo } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Zap, ShieldOff, Droplets, Gauge, ArrowRight, Wind, CircleSlash, Thermometer, AudioWaveform, Pin } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type EcuSolutionsSectionProps = {
  isPageHeader?: boolean;
};

export function EcuSolutionsSection({ isPageHeader = false }: EcuSolutionsSectionProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const ecuServices = useMemo(() => [
    {
      icon: <ShieldOff className="w-10 h-10 text-primary" />,
      title: t('ecu_dtc_off_title'),
      description: t('ecu_dtc_off_desc'),
      id: 'dtc_off'
    },
    {
      icon: <Zap className="w-10 h-10 text-primary" />,
      title: t('ecu_egr_off_title'),
      description: t('ecu_egr_off_desc'),
      id: 'egr_off'
    },
    {
      icon: <Droplets className="w-10 h-10 text-primary" />,
      title: t('ecu_adblue_off_title'),
      description: t('ecu_adblue_off_desc'),
      id: 'adblue_off'
    },
    {
      icon: <Gauge className="w-10 h-10 text-primary" />,
      title: t('ecu_performance_tuning_title'),
      description: t('ecu_performance_tuning_desc'),
      id: 'performance_tuning'
    },
    {
      icon: <Wind className="w-10 h-10 text-primary" />,
      title: t('ecu_flaps_off_title'),
      description: t('ecu_flaps_off_desc'),
      id: 'flaps_off'
    },
    {
      icon: <CircleSlash className="w-10 h-10 text-primary" />,
      title: t('ecu_nox_off_title'),
      description: t('ecu_nox_off_desc'),
      id: 'nox_off'
    },
    {
      icon: <Thermometer className="w-10 h-10 text-primary" />,
      title: t('ecu_tva_off_title'),
      description: t('ecu_tva_off_desc'),
      id: 'tva_off'
    },
    {
      icon: <AudioWaveform className="w-10 h-10 text-primary" />,
      title: t('ecu_lambda_off_title'),
      description: t('ecu_lambda_off_desc'),
      id: 'lambda_off'
    },
    {
      icon: <Pin className="w-10 h-10 text-primary" />,
      title: t('ecu_radio_pin_title'),
      description: t('ecu_radio_pin_desc'),
      id: 'radio_pin'
    },
  ], [t]);
  
  const handleCardClick = (serviceId: string) => {
    router.push(`/ecu-tuning?service=${serviceId}`);
  };

  return (
    <section id="ecu" className={isPageHeader ? "pt-20 pb-10 bg-card" : "py-20 bg-card"}>
      <div className="container">
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline uppercase tracking-wider">{t('ecu_solutions_title')}</h2>
            <p className="text-muted-foreground mt-4 max-w-3xl mx-auto">{t('ecu_solutions_subtitle')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ecuServices.map((service) => (
            <Card 
              key={service.id} 
              className="relative overflow-hidden text-center p-6 flex flex-col items-center border-2 border-transparent hover:border-primary hover:shadow-xl transition-all duration-300 cursor-pointer group"
              onClick={() => handleCardClick(service.id)}
            >
              {service.id === 'radio_pin' && (
                <div className="absolute top-0 right-0 h-16 w-16">
                  <div className="absolute transform rotate-45 bg-destructive text-center text-destructive-foreground font-semibold py-1 right-[-34px] top-[32px] w-[170px]">
                    Free
                  </div>
                </div>
              )}
              <CardHeader className="p-0 mb-4">
                <div className="mb-4 transition-transform duration-300 group-hover:scale-110">
                    {service.icon}
                </div>
                <CardTitle className="mt-4">{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <CardDescription>{service.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
        {!isPageHeader && (
          <div className="mt-12 text-center">
            <Button asChild size="lg">
              <Link href="/ecu-tuning">
                {t('ecu_upload_file_cta')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
