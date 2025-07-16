
'use server';

import db from '@/lib/db';
import { sendEmail } from '@/services/email';
import type { TuningRequest } from '@/lib/mock-data';
import { z } from 'zod';
import { uploadFileToS3 } from './storage';

// Define the schema for tuning requests to match the database table
const TuningRequestSchema = z.object({
    id: z.number().int().positive(),
    name: z.string(),
    email: z.string().email(),
    vehicle: z.string(),
    service: z.string(),
    fileType: z.enum(['eeprom', 'flash', 'full_backup']),
    date: z.string(),
    status: z.enum(['Pending', 'Awaiting Payment', 'Completed']),
    price: z.number().nullable(),
    original_file_url: z.string().url().nullable(),
    modified_file_url: z.string().url().nullable(),
    notes: z.string().nullable(),
});

// We are now fetching from the DB, so the return type will match the schema
export async function getRequests(): Promise<TuningRequest[]> {
  try {
    const [rows] = await db.execute("SELECT id, name, email, vehicle, service, file_type as fileType, DATE_FORMAT(date, '%Y-%m-%d') as date, status, price, original_file_url as originalFileUrl, modified_file_url as modifiedFileUrl, notes FROM tuning_requests ORDER BY date DESC");
    return rows as TuningRequest[];
  } catch (error) {
    console.error("Failed to fetch tuning requests:", error);
    return [];
  }
}

// Schema for validating form data before processing
const CreateRequestFormSchema = z.object({
    name: z.string().min(2, "Name is too short"),
    email: z.string().email("Invalid email format"),
    vehicle: z.string().min(3, "Vehicle details are required"),
    service: z.string().min(3, "Service details are required"),
    fileType: z.enum(['eeprom', 'flash', 'full_backup']),
    notes: z.string().optional(),
    file: z.instanceof(File),
});

export async function createRequest(formData: FormData): Promise<{ success: boolean; error?: string }> {
    const parsed = CreateRequestFormSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        vehicle: formData.get('vehicle'),
        service: formData.get('service'),
        fileType: formData.get('fileType'),
        notes: formData.get('notes'),
        file: formData.get('file'),
    });

    if (!parsed.success) {
        return { success: false, error: parsed.error.errors.map(e => e.message).join(', ') };
    }

    const { name, email, vehicle, service, fileType, notes, file } = parsed.data;

    try {
        // Generate a unique file name to prevent overwrites in S3
        const uniqueFileName = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;

        // 1. Upload the file to S3
        const fileUrl = await uploadFileToS3(file, uniqueFileName);

        // 2. Insert the request details into the database
        await db.execute(
            'INSERT INTO tuning_requests (name, email, vehicle, service, file_type, notes, original_file_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, email, vehicle, service, fileType, notes, fileUrl]
        );

        // Optional: Send an email notification to the admin
        await sendEmail({
            to: process.env.ADMIN_EMAIL || 'contact@maxdrive.com', // Admin's email
            subject: `New Tuning Request: ${vehicle}`,
            html: `
                <h1>New ECU Tuning Request</h1>
                <p>A new request has been submitted.</p>
                <ul>
                    <li><strong>Client:</strong> ${name} (${email})</li>
                    <li><strong>Vehicle:</strong> ${vehicle}</li>
                    <li><strong>Service:</strong> ${service}</li>
                    <li><strong>File Link:</strong> <a href="${fileUrl}">${fileUrl}</a></li>
                </ul>
            `
        });

        return { success: true };
    } catch (error) {
        console.error("Failed to create tuning request:", error);
        return { success: false, error: "An unexpected server error occurred." };
    }
}

export async function updateRequestStatus(requestId: number, status: TuningRequest['status'], price?: number): Promise<{ success: boolean; error?: string }> {
    try {
        // Fetch the request to get client email for notification
        const [rows] = await db.execute('SELECT email, vehicle, service FROM tuning_requests WHERE id = ?', [requestId]);
        const request = (rows as any[])[0];

        if (!request) {
            return { success: false, error: 'Request not found.' };
        }

        // Generate a placeholder URL for the modified file when completed
        let modifiedFileUrl = null;
        if (status === 'Completed') {
            modifiedFileUrl = '#'; // In a real app, you would upload the modified file and get a new URL
        }

        await db.execute(
            'UPDATE tuning_requests SET status = ?, price = ?, modified_file_url = ? WHERE id = ?',
            [status, price ?? null, modifiedFileUrl, requestId]
        );

        // Send email notifications based on status change
        if (status === 'Awaiting Payment' && price) {
            await sendEmail({
                to: request.email,
                subject: `Your Quote for ${request.vehicle} Tuning`,
                html: `<h1>Your Quote is Ready</h1><p>The price for the service "${request.service}" on your ${request.vehicle} is <strong>$${price?.toFixed(2)}</strong>. Please follow the instructions sent in a separate email to complete payment.</p>`
            });
        } else if (status === 'Completed') {
            await sendEmail({
                to: request.email,
                subject: `Your Tuning for ${request.vehicle} is Complete!`,
                html: `<h1>Your File is Ready!</h1><p>Your requested tuning service "${request.service}" for your ${request.vehicle} is complete. You can download your modified file from your client dashboard.</p>`
            });
        }

        return { success: true };
    } catch (error) {
        console.error("Failed to update tuning request status:", error);
        return { success: false, error: 'An unexpected server error occurred.' };
    }
}


export async function deleteRequest(requestId: number): Promise<void> {
    try {
        // Optional: Add logic here to delete the file from S3 before deleting the DB record.
        await db.execute('DELETE FROM tuning_requests WHERE id = ?', [requestId]);
    } catch (error) {
        console.error("Failed to delete tuning request:", error);
        throw new Error("Could not delete tuning request.");
    }
}

// Analytics Functions
export type TuningRequestStatusCounts = {
    Pending: number;
    'Awaiting Payment': number;
    Completed: number;
};

export async function getTuningRequestStatusCounts(): Promise<TuningRequestStatusCounts> {
    try {
        const query = `
            SELECT
                SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as Pending,
                SUM(CASE WHEN status = 'Awaiting Payment' THEN 1 ELSE 0 END) as 'Awaiting Payment',
                SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as Completed
            FROM tuning_requests;
        `;
        const [rows] = await db.execute(query);
        const counts = (rows as any)[0];
        // Ensure numbers are returned, not strings
        return {
            Pending: parseInt(counts.Pending, 10) || 0,
            'Awaiting Payment': parseInt(counts['Awaiting Payment'], 10) || 0,
            Completed: parseInt(counts.Completed, 10) || 0,
        };
    } catch (error) {
        console.error("Failed to fetch tuning request status counts:", error);
        return {
            Pending: 0,
            'Awaiting Payment': 0,
            Completed: 0,
        };
    }
}
