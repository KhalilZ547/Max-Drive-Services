
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getSettings, updateSettings } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle, Trash2, Image as ImageIcon } from 'lucide-react';

type FormValues = {
  contact_email: string;
  contact_phone: string;
  social_instagram: string;
  social_facebook: string;
  social_whatsapp: string;
  carousel_images: { url: string }[];
  service_oil_change_image: string;
  service_brake_repair_image: string;
  service_engine_diagnostic_image: string;
  service_ecu_solutions_image: string;
  hero_section_image: string;
};

export default function SettingsPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      carousel_images: [{ url: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'carousel_images',
  });

  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      const settings = await getSettings();
      const carouselImages = JSON.parse(settings.carousel_images || '[]');
      reset({
        ...settings,
        carousel_images: carouselImages.map((url: string) => ({ url })),
      });
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      toast({ title: 'Error', description: 'Could not load site settings.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [reset, toast]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    const formData = new FormData();
    
    // Append all fields to formData
    Object.entries(data).forEach(([key, value]) => {
        if (key !== 'carousel_images') {
             formData.append(key, value as string);
        }
    });

    // Handle carousel images separately
    data.carousel_images.forEach((image, index) => {
        if (image.url) {
            formData.append(`carousel_image_${index}`, image.url);
        }
    });

    const result = await updateSettings(formData);
    if (result.success) {
      toast({ title: 'Settings Saved', description: 'Your changes have been published.' });
    } else {
      toast({ title: 'Error', description: result.error, variant: 'destructive' });
    }
    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-40 mb-2" />
            <Skeleton className="h-4 w-72" />
          </CardHeader>
          <CardContent className="space-y-8">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-32" />
          </CardFooter>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Site Settings</CardTitle>
            <CardDescription>Manage your website’s public information and images from one place.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Contact & Social</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-lg">
                <div>
                  <Label htmlFor="contact_email">Contact Email</Label>
                  <Input id="contact_email" {...register('contact_email')} />
                </div>
                <div>
                  <Label htmlFor="contact_phone">Contact Phone</Label>
                  <Input id="contact_phone" {...register('contact_phone')} />
                </div>
                <div>
                  <Label htmlFor="social_instagram">Instagram URL</Label>
                  <Input id="social_instagram" {...register('social_instagram')} />
                </div>
                <div>
                  <Label htmlFor="social_facebook">Facebook URL</Label>
                  <Input id="social_facebook" {...register('social_facebook')} />
                </div>
                 <div>
                  <Label htmlFor="social_whatsapp">WhatsApp URL</Label>
                  <Input id="social_whatsapp" {...register('social_whatsapp')} />
                </div>
              </div>
            </div>

            {/* Image Settings */}
             <div className="space-y-4">
                <h3 className="text-lg font-medium">Image URLs</h3>
                 <div className="space-y-4 border p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                        <ImageIcon className="h-5 w-5 text-muted-foreground" />
                        <h4 className="font-medium">Homepage Hero Image</h4>
                    </div>
                    <Input placeholder="https://example.com/hero-image.png" {...register('hero_section_image')} />
                </div>
                <div className="space-y-4 border p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                        <ImageIcon className="h-5 w-5 text-muted-foreground" />
                        <h4 className="font-medium">Service Detail Images</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label>Oil Change Image URL</Label>
                            <Input placeholder="https://..." {...register('service_oil_change_image')} />
                        </div>
                        <div>
                            <Label>Brake Repair Image URL</Label>
                            <Input placeholder="https://..." {...register('service_brake_repair_image')} />
                        </div>
                        <div>
                            <Label>Engine Diagnostic Image URL</Label>
                            <Input placeholder="https://..." {...register('service_engine_diagnostic_image')} />
                        </div>
                        <div>
                            <Label>ECU Solutions Image URL</Label>
                            <Input placeholder="https://..." {...register('service_ecu_solutions_image')} />
                        </div>
                    </div>
                </div>
                <div className="space-y-4 border p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                        <ImageIcon className="h-5 w-5 text-muted-foreground" />
                        <h4 className="font-medium">Homepage Image Carousel</h4>
                    </div>
                     {fields.map((field, index) => (
                        <div key={field.id} className="flex items-end gap-2">
                            <div className="flex-grow">
                                <Label htmlFor={`carousel_images.${index}.url`}>Image {index + 1} URL</Label>
                                <Input id={`carousel_images.${index}.url`} placeholder="https://example.com/carousel-image.png" {...register(`carousel_images.${index}.url`)} />
                            </div>
                            <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={() => append({ url: '' })}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Image
                    </Button>
                </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </form>
    </main>
  );
}
