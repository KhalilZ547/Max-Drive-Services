
'use server';

import * as settingsService from '@/services/settings';
import { revalidatePath } from 'next/cache';

export async function getSettings() {
    return settingsService.getAllSettings();
}

export async function updateSettings(formData: FormData) {
    const settings: Record<string, any> = {};

    // Group carousel images into a JSON array
    const carouselImages: string[] = [];
    formData.forEach((value, key) => {
        if (key.startsWith('carousel_image_')) {
            if (typeof value === 'string' && value.trim() !== '') {
                carouselImages.push(value);
            }
        } else {
            settings[key] = value;
        }
    });
    settings['carousel_images'] = JSON.stringify(carouselImages);
    
    try {
        await settingsService.updateSettings(settings);
        // Revalidate all public paths that might use these settings
        revalidatePath('/');
        revalidatePath('/#contact');
        revalidatePath('/service/[serviceId]', 'page');
        return { success: true };
    } catch (error) {
        console.error('Failed to update settings:', error);
        return { success: false, error: 'Could not update settings.' };
    }
}
