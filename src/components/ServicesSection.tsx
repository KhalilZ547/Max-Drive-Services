'use client';

import { useTranslation } from '@/hooks/use-translation';
import { Card, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Car, Wrench, CircleGauge, BrainCircuit } from 'lucide-react';

export function ServicesSection() {
  const { t } = useTranslation();

  const services = [
    {
      icon: <Wrench className="w-10 h-10 text-primary" />,
      title: t('service_oil_change_title'),
      description: t('service_oil_change_desc'),
    },
    {
      icon: <Car className="w-10 h-10 text-primary" />,
      title: t('service_tire_rotation_title'),
      description: t('service_tire_rotation_desc'),
    },
    {
      icon: <CircleGauge className="w-10 h-10 text-primary" />,
      title: t('service_brake_repair_title'),
      description: t('service_brake_repair_desc'),
    },
    {
      icon: <BrainCircuit className="w-10 h-10 text-primary" />,
      title: t('service_engine_diagnostic_title'),
      description: t('service_engine_diagnostic_desc'),
    },
  ];

  return (
    <section id="services" className="py-20 bg-background">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{t('services_title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="text-center p-6 flex flex-col items-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="p-0 mb-4">
                {service.icon}
                <CardTitle className="mt-4">{service.title}</CardTitle>
              </CardHeader>
              <CardDescription>{service.description}</CardDescription>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
