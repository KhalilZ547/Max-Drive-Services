
'use client';

import { useState, useEffect, useMemo } from 'react';
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
import { Skeleton } from './ui/skeleton';

export function ImageCarousel({ settings }: { settings: Record<string, string> }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const images = useMemo(() => {
    try {
      if (settings?.carousel_images) {
        const parsedImages = JSON.parse(settings.carousel_images);
        if (Array.isArray(parsedImages) && parsedImages.length > 0) {
          return parsedImages.map((url: string) => ({
            src: url,
            alt: 'A showcase of our garage and services.',
          }));
        }
      }
    } catch (e) {
      console.error("Failed to parse carousel images from settings:", e);
    }
    // Fallback images if settings are not available or invalid
    return [
      { src: 'https://placehold.co/800x450.png', alt: 'A modern car garage with several cars being serviced.' },
      { src: 'https://placehold.co/800x450.png', alt: 'A mechanic using diagnostic tools on a car engine.' },
      { src: 'https://placehold.co/800x450.png', alt: 'A close-up of a perfectly balanced tire.' },
    ];
  }, [settings]);
  
  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);
  
  if (!settings) {
    return (
        <section className="pt-10 pb-20 bg-background">
            <div className="container">
                <Skeleton className="w-full max-w-6xl mx-auto h-[300px] rounded-lg" />
            </div>
        </section>
    );
  }

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
