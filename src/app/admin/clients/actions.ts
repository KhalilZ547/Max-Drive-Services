
'use server';

import { revalidatePath } from 'next/cache';
import * as clientService from '@/services/clients';
import type { Client } from '@/services/clients';

export async function getClients(): Promise<Client[]> {
    return clientService.getClients();
}

export async function addClient(newClientData: Omit<Client, 'id' | 'registered' | 'avatar_url' | 'role'>): Promise<{ success: boolean; error?: string }> {
    const result = await clientService.addClient(newClientData);
    if (result.success) {
        revalidatePath('/admin/clients'); // This re-fetches the data on the page.
    }
    return result;
}

export async function updateClient(updatedClient: Omit<Client, 'registered' | 'avatar_url' | 'role'>): Promise<{ success: boolean; error?: string }> {
    const result = await clientService.updateClient(updatedClient);
     if (result.success) {
        revalidatePath('/admin/clients');
    }
    return result;
}

export async function deleteClient(clientId: string): Promise<void> {
    await clientService.deleteClient(clientId);
    revalidatePath('/admin/clients');
}
