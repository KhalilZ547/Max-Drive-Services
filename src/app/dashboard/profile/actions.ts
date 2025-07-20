
'use server';

import { revalidatePath } from 'next/cache';
import * as clientService from '@/services/clients';
import { uploadFileToS3 } from '@/services/storage';
import { getUserId } from '@/services/auth'; // We'll create this service

export async function getClientProfile() {
    const userId = await getUserId();
    if (!userId) {
        throw new Error("Not authenticated");
    }
    return clientService.getClientById(userId);
}

export async function updateClientProfile(formData: FormData) {
    const userId = await getUserId();
    if (!userId) {
        return { success: false, error: 'Authentication required.' };
    }

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const avatarFile = formData.get('avatar') as File | null;
    
    let avatarUrl: string | undefined = undefined;

    if (avatarFile && avatarFile.size > 0) {
        // Create a unique file name to prevent overwrites in S3
        const uniqueFileName = `avatars/${userId}-${Date.now()}-${avatarFile.name}`;
        try {
            avatarUrl = await uploadFileToS3(avatarFile, uniqueFileName);
        } catch (error) {
            console.error("Avatar upload failed:", error);
            return { success: false, error: 'Failed to upload new avatar.' };
        }
    }
    
    const result = await clientService.updateClientProfile({ id: userId, name, email, avatarUrl });

    if (result.success) {
        revalidatePath('/dashboard/profile');
    }

    return result;
}

export async function deleteClientAvatar() {
     const userId = await getUserId();
    if (!userId) {
        return { success: false, error: 'Authentication required.' };
    }

    // This sets the avatar_url to NULL in the database.
    // In a real app, you might also want to delete the old file from S3.
    const result = await clientService.updateClientProfile({ id: userId, avatarUrl: null });
    
    if (result.success) {
        revalidatePath('/dashboard/profile');
    }
    
    return result;
}
