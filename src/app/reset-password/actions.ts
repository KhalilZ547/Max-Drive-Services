
'use server';

import db from '@/lib/db';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import * as clientService from '@/services/clients';

const ResetPasswordSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export async function resetPassword(data: unknown): Promise<{ success: boolean; error?: string }> {
  const validation = ResetPasswordSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: 'Invalid data provided.' };
  }

  const { email, password } = validation.data;

  try {
    const client = await clientService.getClientByEmail(email);
    if (!client) {
      // This should ideally not happen if the flow is followed, but it's a good safeguard.
      return { success: false, error: 'User not found.' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute(
      'UPDATE clients SET password = ? WHERE id = ?',
      [hashedPassword, client.id]
    );

    return { success: true };

  } catch (error) {
    console.error('Password Reset Error:', error);
    return { success: false, error: 'An unexpected server error occurred.' };
  }
}
