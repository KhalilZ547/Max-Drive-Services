
'use client';

import * as React from 'react';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const images = [
  {
    src: 'https://placehold.co/800x450.png',
    alt: 'A modern car garage with several cars being serviced.',
    hint: 'car garage',
  },
  {
    src: 'https://placehold.co/800x450.png',
    alt: 'A mechanic using diagnostic tools on a car engine.',
    hint: 'mechanic diagnostic',
  },
  {
    src: 'https://placehold.co/800x450.png',
    alt: 'A close-up of a perfectly balanced tire.',
    hint: 'car tire',
  },
  {
    src: 'https://placehold.co/800x450.png',
    alt: 'A clean and organized workshop with tools on the wall.',
    hint: 'workshop tools',
  },
  {
    src: 'https://placehold.co/800x450.png',
    alt: 'A shiny red sports car in the garage.',
    hint: 'sports car',
  },
];

export function ImageCarousel() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <section className="pt-10 pb-20 bg-background">
      <div className="container">
        <Carousel
          setApi={setApi}
          className="w-full max-w-6xl mx-auto group"
          opts={{
            align: 'center',
            loop: true,
          }}
        >
          <CarouselContent className="-ml-4">
            {images.map((image, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 pl-4">
                <div
                  className={cn(
                    'transition-all duration-300 ease-in-out',
                    current === index
                      ? 'scale-100 opacity-100'
                      : 'scale-90 opacity-60'
                  )}
                >
                  <Card className="overflow-hidden rounded-lg shadow-lg">
                    <CardContent className="relative flex aspect-video items-center justify-center p-0">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-cover"
                        data-ai-hint={image.hint}
                      />
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-[-50px] top-1/2 -translate-y-1/2 z-10 hidden sm:flex opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CarouselNext className="absolute right-[-50px] top-1/2 -translate-y-1/2 z-10 hidden sm:flex opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Carousel>
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              onClick={() => api?.scrollTo(i)}
              className={cn(
                'h-2 w-2 rounded-full transition-all duration-300',
                current === i ? 'w-6 bg-primary' : 'bg-muted-foreground/50'
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
