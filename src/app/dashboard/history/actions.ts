
'use server';

import db from '@/lib/db';
import { getUserId } from '@/services/auth';

export interface ServiceHistoryItem {
  id: number;
  vehicle: string;
  service: string;
  date: string;
  cost: number;
}

export async function getServiceHistory(): Promise<ServiceHistoryItem[]> {
    const userId = await getUserId();
    if (!userId) {
        return [];
    }

    try {
        const [rows] = await db.execute(`
            SELECT 
                h.id, 
                CONCAT(v.make, ' ', v.model, ' ', v.year) as vehicle, 
                h.service, 
                DATE_FORMAT(h.date, '%Y-%m-%d') as date, 
                h.cost 
            FROM service_history h
            JOIN vehicles v ON h.vehicle_id = v.id
            WHERE h.client_id = ?
            ORDER BY h.date DESC
        `, [userId]);
        return rows as ServiceHistoryItem[];
    } catch (error) {
        console.error('Failed to fetch service history:', error);
        return [];
    }
}
