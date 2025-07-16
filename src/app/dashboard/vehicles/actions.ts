
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
// Assuming db connection is set up in '@/lib/db'
// import db from '@/lib/db'; 

// For demonstration, we'll use a mock in-memory store.
// Replace this with actual database calls in production.
type Vehicle = { id: string; make: string; model: string; year: number; vin: string; userId: string; };
const mockVehicles: Vehicle[] = [];
let nextId = 1;

// Mock function to get user ID. In a real app, this would come from the session.
const getUserId = () => 'mock_user_123';

const AddVehicleSchema = z.object({
  make: z.string().min(2, "Make must be at least 2 characters."),
  model: z.string().min(1, "Model is required."),
  year: z.number().min(1900, "Invalid year.").max(new Date().getFullYear() + 1),
  vin: z.string().optional(),
});

export async function getVehicles(): Promise<Omit<Vehicle, 'userId'>[]> {
    const userId = getUserId();
    // In a real app: const [rows] = await db.execute('SELECT id, make, model, year, vin FROM vehicles WHERE user_id = ?', [userId]);
    const userVehicles = mockVehicles.filter(v => v.userId === userId);
    return userVehicles.map(({ userId, ...rest }) => rest);
}

export async function addVehicle(data: unknown): Promise<{ success: boolean; error?: string }> {
    const validated = AddVehicleSchema.safeParse(data);
    if (!validated.success) {
        return { success: false, error: validated.error.errors.map(e => e.message).join(', ') };
    }
    
    const userId = getUserId();
    const newVehicle = { ...validated.data, id: `veh_${nextId++}`, userId };

    // In a real app: await db.execute('INSERT INTO vehicles (make, model, year, vin, user_id) VALUES (?, ?, ?, ?, ?)', [newVehicle.make, newVehicle.model, newVehicle.year, newVehicle.vin, newVehicle.userId]);
    mockVehicles.push(newVehicle);
    
    revalidatePath('/dashboard/vehicles');
    return { success: true };
}
