'use server';

import { revalidatePath } from 'next/cache';
import db from '@/lib/db';
import { sendEmail } from '@/services/email';
import type { Client } from '@/lib/mock-data'; // We can re-use the type for now

// A helper function to simulate a delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getClients(): Promise<Client[]> {
  try {
    const [rows] = await db.execute("SELECT id, name, email, DATE_FORMAT(registered, '%Y-%m-%d') as registered FROM clients ORDER BY registered DESC");
    // The 'as Client[]' cast is safe here if your DB schema matches the Client type.
    return rows as Client[];
  } catch (error) {
    console.error("Failed to fetch clients:", error);
    // In a real app, you might throw a custom error or return an empty array
    return [];
  }
}

export async function addClient(newClientData: Omit<Client, 'id' | 'registered'>): Promise<{ success: boolean; error?: string }> {
  const { name, email } = newClientData;
  const registered = new Date();
  
  try {
    await db.execute(
      'INSERT INTO clients (name, email, registered) VALUES (?, ?, ?)',
      [name, email, registered]
    );

    // This is a mock URL. In production, you'd use your actual domain from environment variables.
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

    revalidatePath('/admin/clients'); // Tell Next.js to refresh the data on this page
    return { success: true };
  } catch (error: any) {
     // Check for duplicate email error (MySQL error code 1062)
    if (error.code === 'ER_DUP_ENTRY') {
      console.error("Failed to add client:", "Email already exists.");
      return { success: false, error: 'A client with this email address already exists.' };
    }
    console.error("Failed to add client:", error);
    return { success: false, error: 'An unexpected error occurred.' };
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
        return { success: false, error: 'An unexpected error occurred.' };
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
        // Handle error as needed
    }
}
