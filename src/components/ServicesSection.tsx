
'use client';

import { useMemo } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { Card, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Wrench, CircleGauge, BrainCircuit, Cpu } from 'lucide-react';
import Link from 'next/link';

export function ServicesSection() {
  const { t } = useTranslation();

  const services = useMemo(() => [
    {
      id: 'oil-change',
      icon: <Wrench className="w-10 h-10 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-12" />,
      title: t('service_oil_change_title'),
      description: t('service_oil_change_desc'),
    },
    {
      id: 'brake-repair',
      icon: <CircleGauge className="w-10 h-10 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />,
      title: t('service_brake_repair_title'),
      description: t('service_brake_repair_desc'),
    },
    {
      id: 'engine-diagnostic',
      icon: <BrainCircuit className="w-10 h-10 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6" />,
      title: t('service_engine_diagnostic_title'),
      description: t('service_engine_diagnostic_desc'),
    },
    {
      id: 'ecu-solutions',
      icon: <Cpu className="w-10 h-10 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />,
      title: t('service_ecu_solutions_title'),
      description: t('service_ecu_solutions_desc'),
    },
  ], [t]);

  return (
    <section id="services" className="pt-4 pb-20 bg-background">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-headline uppercase tracking-wider">{t('services_title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <Link key={service.id} href={`/service/${service.id}`} className="group block">
              <Card className="text-center p-6 flex flex-col items-center h-full hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="p-0 mb-4">
                  {service.icon}
                  <CardTitle>{service.title}</CardTitle>
                </CardHeader>
                <CardDescription>{service.description}</CardDescription>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
