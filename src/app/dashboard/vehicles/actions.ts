
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import db from '@/lib/db'; 
import { getUserId } from '@/services/auth';

const VehicleSchema = z.object({
  make: z.string().min(2, "Make must be at least 2 characters."),
  model: z.string().min(1, "Model is required."),
  year: z.coerce.number().min(1900, "Invalid year.").max(new Date().getFullYear() + 1),
  vin: z.string().optional(),
});

export type VehicleData = z.infer<typeof VehicleSchema> & { id: string };

export async function getVehicles(): Promise<VehicleData[]> {
    const userId = await getUserId();
    if (!userId) {
        return [];
    }
    
    try {
        const [rows] = await db.execute('SELECT id, make, model, year, vin FROM vehicles WHERE user_id = ? ORDER BY year DESC', [userId]);
        return rows as VehicleData[];
    } catch (error) {
        console.error("Failed to fetch vehicles:", error);
        return [];
    }
}

export async function addVehicle(data: unknown): Promise<{ success: boolean; error?: string; newVehicleId?: string; }> {
    const validated = VehicleSchema.safeParse(data);
    if (!validated.success) {
        return { success: false, error: validated.error.errors.map(e => e.message).join(', ') };
    }
    
    const userId = await getUserId();
     if (!userId) {
        return { success: false, error: 'Authentication required.' };
    }
    
    const { make, model, year, vin } = validated.data;

    try {
        const [result] = await db.execute(
            'INSERT INTO vehicles (user_id, make, model, year, vin) VALUES (?, ?, ?, ?, ?)', 
            [userId, make, model, year, vin || '']
        );
        
        const newId = (result as any).insertId;

        revalidatePath('/dashboard/vehicles');
        revalidatePath('/dashboard/appointment');
        return { success: true, newVehicleId: newId.toString() };
    } catch (error) {
        console.error("Failed to add vehicle:", error);
        return { success: false, error: 'An unexpected server error occurred.' };
    }
}

export async function updateVehicle(vehicleId: string, data: unknown): Promise<{ success: boolean; error?: string }> {
    const validated = VehicleSchema.safeParse(data);
    if (!validated.success) {
        return { success: false, error: validated.error.errors.map(e => e.message).join(', ') };
    }

    const userId = await getUserId();
    if (!userId) {
        return { success: false, error: 'Authentication required.' };
    }

    const { make, model, year, vin } = validated.data;

    try {
        const [result] = await db.execute(
            'UPDATE vehicles SET make = ?, model = ?, year = ?, vin = ? WHERE id = ? AND user_id = ?', 
            [make, model, year, vin || '', vehicleId, userId]
        );
        
        if ((result as any).affectedRows === 0) {
            return { success: false, error: "Vehicle not found or you don't have permission to edit it." };
        }

        revalidatePath('/dashboard/vehicles');
        return { success: true };
    } catch (error) {
        console.error("Failed to update vehicle:", error);
        return { success: false, error: 'An unexpected server error occurred.' };
    }
}

export async function deleteVehicle(vehicleId: string): Promise<{ success: boolean; error?: string }> {
    const userId = await getUserId();
     if (!userId) {
        return { success: false, error: 'Authentication required.' };
    }

    try {
        const [result] = await db.execute(
            'DELETE FROM vehicles WHERE id = ? AND user_id = ?', 
            [vehicleId, userId]
        );

        if ((result as any).affectedRows === 0) {
            return { success: false, error: "Vehicle not found or you don't have permission to delete it." };
        }

        revalidatePath('/dashboard/vehicles');
        revalidatePath('/dashboard/appointment');
        return { success: true };
    } catch (error) {
        console.error("Failed to delete vehicle:", error);
        return { success: false, error: 'An unexpected server error occurred.' };
    }
}
