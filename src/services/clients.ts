
'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { sendEmail } from '@/services/email';
import type { Client } from '@/lib/mock-data'; // We can re-use the type for now

export async function getClients(): Promise<Client[]> {
  try {
    // Ensure you have a `clients` table with id, name, email, and registered columns.
    const [rows] = await db.execute("SELECT id, name, email, DATE_FORMAT(registered, '%Y-%m-%d') as registered FROM clients ORDER BY registered DESC");
    return rows as Client[];
  } catch (error) {
    console.error("Failed to fetch clients:", error);
    // Return an empty array on error to prevent the page from crashing.
    return [];
  }
}

export async function addClient(newClientData: Omit<Client, 'id' | 'registered'>): Promise<{ success: boolean; error?: string }> {
  const { name, email } = newClientData;
  // The database will handle the `registered` timestamp with DEFAULT CURRENT_TIMESTAMP.
  
  try {
    // Check if email already exists to provide a friendly error message.
    const [existing] = await db.execute('SELECT id FROM clients WHERE email = ?', [email]);
    if ((existing as any[]).length > 0) {
      return { success: false, error: 'A client with this email address already exists.' };
    }

    // Insert the new client. The password will be NULL until they set it.
    await db.execute(
      'INSERT INTO clients (name, email, role) VALUES (?, ?, ?)',
      [name, email, 'client']
    );

    // Send an email to the client to set up their password.
    // In production, get the base URL from environment variables.
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const setupLink = `${baseUrl}/reset-password?email=${encodeURIComponent(email)}`;
    
    await sendEmail({
      to: email,
      subject: "Welcome to Max-Drive-Services! Set up your account.",
      html: `
        <h1>Welcome, ${name}!</h1>
        <p>An account has been created for you at Max-Drive-Services. Please click the link below to set your password and activate your account:</p>
        <a href="${setupLink}" target="_blank" style="display:inline-block;padding:10px 20px;background-color:#2563eb;color:white;text-decoration:none;border-radius:5px;">Set Your Password</a>
        <p>If you were not expecting this, you can safely ignore this email.</p>
      `
    });

    revalidatePath('/admin/clients');
    return { success: true };
  } catch (error: any) {
    console.error("Failed to add client:", error);
    // The ER_DUP_ENTRY error code is specific to MySQL for duplicate entries.
    if (error.code === 'ER_DUP_ENTRY') {
      return { success: false, error: 'A client with this email address already exists.' };
    }
    return { success: false, error: 'An unexpected server error occurred.' };
  }
}

export async function updateClient(updatedClient: Client): Promise<{ success: boolean; error?: string }> {
    try {
        await db.execute(
            'UPDATE clients SET name = ?, email = ? WHERE id = ?',
            [updatedClient.name, updatedClient.email, updatedClient.id]
        );
        revalidatePath('/admin/clients');
        return { success: true };
    } catch(error: any) {
        if (error.code === 'ER_DUP_ENTRY') {
          return { success: false, error: 'This email address is already in use by another client.' };
        }
        console.error("Failed to update client:", error);
        return { success: false, error: 'An unexpected server error occurred.' };
    }
}

export async function deleteClient(clientId: string): Promise<void> {
    try {
        await db.execute(
            'DELETE FROM clients WHERE id = ?',
            [clientId]
        );
        revalidatePath('/admin/clients');
    } catch(error) {
        console.error("Failed to delete client:", error);
        throw new Error("Could not delete client.");
    }
}

// Analytics Functions
export type MonthlyClient = { month: string; total: number };

export async function getClientsPerMonth(): Promise<MonthlyClient[]> {
    try {
        const query = `
            SELECT 
                DATE_FORMAT(registered, '%Y-%m') as month, 
                COUNT(id) as total 
            FROM clients 
            GROUP BY month 
            ORDER BY month ASC;
        `;
        const [rows] = await db.execute(query);
        return rows as MonthlyClient[];
    } catch (error) {
        console.error("Failed to fetch monthly client data:", error);
        throw new Error("Could not fetch monthly client data.");
    }
}

export async function getTotalClientsCount(): Promise<number> {
    try {
        const [rows] = await db.execute("SELECT COUNT(id) as total FROM clients");
        const total = (rows as any)[0]?.total;
        return total ? Number(total) : 0;
    } catch (error) {
        console.error("Failed to fetch total clients count:", error);
        return 0; // Return 0 instead of throwing an error
    }
}
