
'use client';

import { useMemo } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { Card, CardContent } from './ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Star } from 'lucide-react';

export function TestimonialsSection() {
  const { t } = useTranslation();

  const testimonials = useMemo(() => [
    {
      text: t('testimonial_1_text'),
      author: t('testimonial_1_author'),
      avatar: 'A',
    },
    {
      text: t('testimonial_2_text'),
      author: t('testimonial_2_author'),
      avatar: 'F',
    },
    {
      text: t('testimonial_3_text'),
      author: t('testimonial_3_author'),
      avatar: 'J',
    },
  ], [t]);

  return (
    <section id="testimonials" className="py-20 bg-card">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-headline uppercase tracking-wider">{t('testimonials_title')}</h2>
        <Carousel opts={{ loop: true }} className="w-full max-w-4xl mx-auto">
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card className="p-8">
                    <CardContent className="flex flex-col items-center text-center gap-4 p-0">
                      <div className="flex gap-1 text-yellow-500">
                        {[...Array(5)].map((_, i) => <Star key={i} fill="currentColor" />)}
                      </div>
                      <p className="text-lg italic text-foreground/80">"{testimonial.text}"</p>
                      <div className="flex items-center gap-4 mt-4">
                        <Avatar>
                          <AvatarImage src={`https://placehold.co/40x40.png?text=${testimonial.avatar}`} />
                          <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                        </Avatar>
                        <span className="font-semibold">{testimonial.author}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}
