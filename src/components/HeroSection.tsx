
'use client';

import { useTranslation } from '@/hooks/use-translation';
import { Button } from './ui/button';
import Link from 'next/link';
import Image from 'next/image';

export function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="relative bg-card pt-20 md:pt-32 pb-10">
      <div className="absolute inset-0">
        <Image
          src="https://placehold.co/1920x1080.png"
          alt="Mechanic working on a car"
          layout="fill"
          objectFit="cover"
          className="opacity-10"
          data-ai-hint="car repair"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>
      <div className="container relative z-10 text-center">
        <h1 className="text-4xl md:text-6xl font-headline font-bold text-primary-foreground bg-primary/70 p-4 rounded-lg inline-block">
          {t('hero_title')}
        </h1>

        <div className="my-6 flex justify-center">
          <Image
            src="https://placehold.co/150x150.png"
            alt="Service Highlight"
            width={150}
            height={150}
            className="rounded-full border-4 border-primary/50 shadow-lg"
            data-ai-hint="mechanic tools"
          />
        </div>

        <p className="max-w-3xl mx-auto text-lg md:text-xl text-foreground/80">
          {t('hero_subtitle')}
        </p>
        <div className="mt-8 flex justify-center">
          <Button size="lg" asChild className="text-lg">
            <Link href="/signup">{t('hero_cta')}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
