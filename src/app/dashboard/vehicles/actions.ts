
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
// Assuming db connection is set up in '@/lib/db'
// import db from '@/lib/db'; 

// For demonstration, we'll use a mock in-memory store.
// Replace this with actual database calls in production.
type Vehicle = { id: string; make: string; model: string; year: number; vin: string; userId: string; };
const mockVehicles: Vehicle[] = [
    { id: 'veh_1', make: 'Toyota', model: 'Camry', year: 2021, vin: '12345ABC', userId: 'mock_user_123' },
    { id: 'veh_2', make: 'Honda', model: 'Civic', year: 2022, vin: '67890DEF', userId: 'mock_user_123' },
];
let nextId = 3;

// Mock function to get user ID. In a real app, this would come from the session.
const getUserId = () => 'mock_user_123';

const VehicleSchema = z.object({
  make: z.string().min(2, "Make must be at least 2 characters."),
  model: z.string().min(1, "Model is required."),
  year: z.coerce.number().min(1900, "Invalid year.").max(new Date().getFullYear() + 1),
  vin: z.string().optional(),
});

export type VehicleData = z.infer<typeof VehicleSchema> & { id: string };

export async function getVehicles(): Promise<Omit<Vehicle, 'userId'>[]> {
    const userId = getUserId();
    // In a real app: const [rows] = await db.execute('SELECT id, make, model, year, vin FROM vehicles WHERE user_id = ?', [userId]);
    const userVehicles = mockVehicles.filter(v => v.userId === userId);
    return userVehicles.map(({ userId, ...rest }) => rest);
}

export async function addVehicle(data: unknown): Promise<{ success: boolean; error?: string }> {
    const validated = VehicleSchema.safeParse(data);
    if (!validated.success) {
        return { success: false, error: validated.error.errors.map(e => e.message).join(', ') };
    }
    
    const userId = getUserId();
    const newVehicle = { ...validated.data, id: `veh_${nextId++}`, userId, vin: validated.data.vin || '' };

    // In a real app: await db.execute('INSERT INTO vehicles (make, model, year, vin, user_id) VALUES (?, ?, ?, ?, ?)', [newVehicle.make, newVehicle.model, newVehicle.year, newVehicle.vin, newVehicle.userId]);
    mockVehicles.push(newVehicle);
    
    revalidatePath('/dashboard/vehicles');
    return { success: true };
}

export async function updateVehicle(vehicleId: string, data: unknown): Promise<{ success: boolean; error?: string }> {
    const validated = VehicleSchema.safeParse(data);
    if (!validated.success) {
        return { success: false, error: validated.error.errors.map(e => e.message).join(', ') };
    }

    const userId = getUserId();
    const vehicleIndex = mockVehicles.findIndex(v => v.id === vehicleId && v.userId === userId);

    if (vehicleIndex === -1) {
        return { success: false, error: "Vehicle not found or you don't have permission to edit it." };
    }

    // In a real app: await db.execute('UPDATE vehicles SET make = ?, model = ?, year = ?, vin = ? WHERE id = ? AND user_id = ?', [validated.data.make, validated.data.model, validated.data.year, validated.data.vin, vehicleId, userId]);
    mockVehicles[vehicleIndex] = { ...mockVehicles[vehicleIndex], ...validated.data, vin: validated.data.vin || '' };

    revalidatePath('/dashboard/vehicles');
    return { success: true };
}

export async function deleteVehicle(vehicleId: string): Promise<{ success: boolean; error?: string }> {
    const userId = getUserId();
    const initialLength = mockVehicles.length;
    const filteredVehicles = mockVehicles.filter(v => !(v.id === vehicleId && v.userId === userId));

    if (filteredVehicles.length === initialLength) {
         return { success: false, error: "Vehicle not found or you don't have permission to delete it." };
    }
    
    // In a real app: await db.execute('DELETE FROM vehicles WHERE id = ? AND user_id = ?', [vehicleId, userId]);
    mockVehicles.splice(0, mockVehicles.length, ...filteredVehicles); // Replace the array contents

    revalidatePath('/dashboard/vehicles');
    return { success: true };
}
