
'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { sendEmail } from '@/services/email';

export interface Client {
  id: string;
  name: string;
  email: string;
  registered: string;
  avatar_url: string | null;
  role: 'admin' | 'client';
}

export async function getClients(): Promise<Client[]> {
  try {
    const [rows] = await db.execute("SELECT id, name, email, DATE_FORMAT(registered, '%Y-%m-%d') as registered, avatar_url, role FROM clients ORDER BY registered DESC");
    return rows as Client[];
  } catch (error) {
    console.error("Failed to fetch clients:", error);
    return [];
  }
}

export async function getClientById(clientId: string): Promise<Client | null> {
    try {
        const [rows] = await db.execute("SELECT id, name, email, DATE_FORMAT(registered, '%Y-%m-%d') as registered, avatar_url, role FROM clients WHERE id = ?", [clientId]);
        if((rows as any[]).length > 0) {
            return (rows as Client[])[0];
        }
        return null;
    } catch (error) {
        console.error(`Failed to fetch client with id ${clientId}:`, error);
        return null;
    }
}

export async function getClientByEmail(email: string): Promise<Client | null> {
    try {
        const [rows] = await db.execute("SELECT id, name, email, DATE_FORMAT(registered, '%Y-%m-%d') as registered, avatar_url, role, password FROM clients WHERE email = ?", [email]);
        if((rows as any[]).length > 0) {
            return (rows as any[])[0] as Client;
        }
        return null;
    } catch (error) {
        console.error(`Failed to fetch client with email ${email}:`, error);
        return null;
    }
}

export async function addClient(newClientData: Omit<Client, 'id' | 'registered' | 'avatar_url' | 'role'>): Promise<{ success: boolean; error?: string }> {
  const { name, email } = newClientData;
  
  try {
    const [existing] = await db.execute('SELECT id FROM clients WHERE email = ?', [email]);
    if ((existing as any[]).length > 0) {
      return { success: false, error: 'A client with this email address already exists.' };
    }

    await db.execute(
      'INSERT INTO clients (name, email, role) VALUES (?, ?, ?)',
      [name, email, 'client']
    );

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
    if (error.code === 'ER_DUP_ENTRY') {
      return { success: false, error: 'A client with this email address already exists.' };
    }
    return { success: false, error: 'An unexpected server error occurred.' };
  }
}

export async function updateClient(updatedClient: Omit<Client, 'registered' | 'avatar_url' | 'role'>): Promise<{ success: boolean; error?: string }> {
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


export async function updateClientProfile({ id, name, email, avatarUrl }: { id: string; name?: string; email?: string; avatarUrl?: string | null }): Promise<{ success: boolean; error?: string }> {
    try {
        let query = 'UPDATE clients SET';
        const params = [];
        if(name) {
            query += ' name = ?,';
            params.push(name);
        }
        if(email) {
            query += ' email = ?,';
            params.push(email);
        }
        if(avatarUrl !== undefined) {
             query += ' avatar_url = ?,';
             params.push(avatarUrl);
        }

        if (params.length === 0) {
            return { success: true }; // Nothing to update
        }

        // Remove trailing comma and add WHERE clause
        query = query.slice(0, -1) + ' WHERE id = ?';
        params.push(id);

        await db.execute(query, params);
        
        revalidatePath('/dashboard/profile');
        revalidatePath('/admin/clients');
        return { success: true };
    } catch(error: any) {
        if (error.code === 'ER_DUP_ENTRY') {
          return { success: false, error: 'This email address is already in use by another client.' };
        }
        console.error("Failed to update client profile:", error);
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
        return [];
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
