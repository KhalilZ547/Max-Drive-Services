'use client';

import * as React from 'react';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';

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
];

export function ImageCarousel() {
  return (
    <section className="pt-10 pb-20 bg-background">
      <div className="container">
        <Carousel
          className="w-full max-w-5xl mx-auto"
          opts={{
            loop: true,
          }}
        >
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <Card className="overflow-hidden">
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
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-[-50px] top-1/2 -translate-y-1/2 z-10 hidden sm:flex" />
          <CarouselNext className="absolute right-[-50px] top-1/2 -translate-y-1/2 z-10 hidden sm:flex" />
        </Carousel>
      </div>
    </section>
  );
}
