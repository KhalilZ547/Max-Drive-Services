
'use server';

import db from '@/lib/db';
import { getUserId } from '@/services/auth';
import type { VehicleData } from '@/app/dashboard/vehicles/actions';

export async function getVehiclesForUser(): Promise<VehicleData[]> {
    const userId = await getUserId();
    if (!userId) {
        return [];
    }

    try {
        const [rows] = await db.execute('SELECT id, make, model, year, vin FROM vehicles WHERE user_id = ? ORDER BY year DESC', [userId]);
        return rows as VehicleData[];
    } catch (error) {
        console.error("Failed to fetch user vehicles:", error);
        return [];
    }
}
