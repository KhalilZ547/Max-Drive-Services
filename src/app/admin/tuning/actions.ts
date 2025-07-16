
'use server';

import { revalidatePath } from 'next/cache';
import * as tuningService from '@/services/tuning';
import type { TuningRequest } from '@/lib/mock-data';

export async function getTuningRequests(): Promise<TuningRequest[]> {
    return tuningService.getRequests();
}

export async function addTuningRequest(formData: FormData): Promise<{ success: boolean; error?: string }> {
    const result = await tuningService.createRequest(formData);
    if (result.success) {
        revalidatePath('/admin/tuning');
        revalidatePath('/ecu-tuning');
    }
    return result;
}

export async function updateTuningRequestStatus(requestId: number, status: TuningRequest['status'], price?: number): Promise<{ success: boolean; error?: string }> {
    const result = await tuningService.updateRequestStatus(requestId, status, price);
     if (result.success) {
        revalidatePath('/admin/tuning');
    }
    return result;
}

export async function deleteTuningRequest(requestId: number): Promise<void> {
    await tuningService.deleteRequest(requestId);
    revalidatePath('/admin/tuning');
}
