
'use server';

import { z } from 'zod';
import db from '@/lib/db';
import { getUserId } from '@/services/auth';
import { sendEmail } from './email';
import * as clientService from './clients';

const AppointmentSchema = z.object({
  serviceIds: z.array(z.string()),
  services: z.string(),
  vehicleId: z.string(),
  appointmentDate: z.date(),
  notes: z.string().optional(),
});

type AppointmentData = z.infer<typeof AppointmentSchema>;

export async function addAppointment(data: AppointmentData): Promise<{ success: boolean; error?: string }> {
  const validated = AppointmentSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, error: validated.error.errors.map(e => e.message).join(', ') };
  }

  const userId = await getUserId();
  if (!userId) {
    return { success: false, error: 'Authentication required.' };
  }

  const { vehicleId, appointmentDate, notes, services } = validated.data;

  try {
    const [result] = await db.execute(
      'INSERT INTO appointments (client_id, vehicle_id, appointment_date, notes, services, status) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, vehicleId, appointmentDate, notes || '', services, 'Pending']
    );

    // After successfully inserting, send notification emails
    const user = await clientService.getClientById(userId);
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'contact@maxdrive.com';
    const vehicle = await db.execute('SELECT make, model, year FROM vehicles WHERE id = ?', [vehicleId]);
    const vehicleInfo = (vehicle[0] as any[])[0];

    // Email to Admin
    await sendEmail({
        to: adminEmail,
        subject: `New Appointment: ${services} for ${vehicleInfo.make}`,
        html: `
            <h1>New Appointment Request</h1>
            <p>A new appointment has been booked.</p>
            <ul>
                <li><strong>Client:</strong> ${user?.name} (${user?.email})</li>
                <li><strong>Service(s):</strong> ${services}</li>
                <li><strong>Vehicle:</strong> ${vehicleInfo.make} ${vehicleInfo.model} ${vehicleInfo.year}</li>
                <li><strong>Requested Date:</strong> ${appointmentDate.toLocaleDateString()}</li>
                <li><strong>Notes:</strong> ${notes || 'None'}</li>
            </ul>
        `
    });

    // Confirmation Email to User
    if(user?.email) {
      await sendEmail({
          to: user.email,
          subject: `Your Appointment Confirmation with Max-Drive-Services`,
          html: `
              <h1>Appointment Request Received!</h1>
              <p>Thank you for booking with Max-Drive-Services. We have received your request and will contact you shortly to confirm the exact time.</p>
              <ul>
                  <li><strong>Service(s):</strong> ${services}</li>
                  <li><strong>Vehicle:</strong> ${vehicleInfo.make} ${vehicleInfo.model} ${vehicleInfo.year}</li>
                  <li><strong>Date:</strong> ${appointmentDate.toLocaleDateString()}</li>
              </ul>
              <p>We look forward to seeing you!</p>
          `
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to add appointment:", error);
    return { success: false, error: 'An unexpected server error occurred.' };
  }
}
