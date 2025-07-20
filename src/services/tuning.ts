
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
    const [rows] = await db.execute("SELECT id, name, email, vehicle, service, file_type as fileType, DATE_FORMAT(date, '%Y-%m-%d') as date, status, price, original_file_url, modified_file_url, notes FROM tuning_requests ORDER BY date DESC");
    
    // Map database result to camelCase fields if necessary
    return (rows as any[]).map(row => ({
        id: row.id,
        name: row.name,
        email: row.email,
        vehicle: row.vehicle,
        service: row.service,
        fileType: row.fileType,
        date: row.date,
        status: row.status,
        price: row.price,
        original_file_url: row.original_file_url,
        modifiedFileUrl: row.modified_file_url, // This field is now correctly named `modified_file_url` in the DB
        notes: row.notes,
    })) as TuningRequest[];
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
    notes: z.string().optional(),
    // Conditional fields
    file: z.instanceof(File).optional(),
    fileType: z.enum(['eeprom', 'flash', 'full_backup']).optional(),
    radioSerialNumber: z.string().optional(),
});

export async function createRequest(formData: FormData): Promise<{ success: boolean; error?: string }> {
    const isRadioPinOnly = formData.get('service')?.toString().includes('Radio Pin');

    const parsed = CreateRequestFormSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        vehicle: formData.get('vehicle'),
        service: formData.get('service'),
        notes: formData.get('notes'),
        file: formData.get('file'),
        fileType: formData.get('fileType'),
        radioSerialNumber: formData.get('radioSerialNumber'),
    });

    if (!parsed.success) {
        return { success: false, error: parsed.error.errors.map(e => e.message).join(', ') };
    }

    const { name, email, vehicle, service, notes, file, fileType, radioSerialNumber } = parsed.data;

    try {
        let fileUrl = null;
        let finalNotes = notes || '';

        // Handle file upload for non-radio-pin services
        if (!isRadioPinOnly && file) {
            const uniqueFileName = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
            fileUrl = await uploadFileToS3(file, uniqueFileName);
        }

        // Handle radio pin service
        if (isRadioPinOnly && radioSerialNumber) {
            finalNotes = `Radio Serial Number: ${radioSerialNumber}. ${notes || ''}`.trim();
        }
        
        // Insert the request details into the database
        await db.execute(
            'INSERT INTO tuning_requests (name, email, vehicle, service, file_type, notes, original_file_url, status, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [name, email, vehicle, service, fileType || null, finalNotes, fileUrl, isRadioPinOnly ? 'Completed' : 'Pending', isRadioPinOnly ? 0 : null]
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
                    ${fileUrl ? `<li><strong>File Link:</strong> <a href="${fileUrl}">${fileUrl}</a></li>` : ''}
                    ${isRadioPinOnly ? `<li><strong>Radio Serial:</strong> ${radioSerialNumber}</li>` : ''}
                </ul>
            `
        });

        // If it's a free radio pin service, send the "complete" email immediately
        if (isRadioPinOnly) {
             await sendEmail({
                to: email,
                subject: `Your Radio Pin Request for ${vehicle}`,
                html: `<h1>We've Received Your Request!</h1><p>Thank you for submitting your radio serial number. We will process it and send you the pin code in a separate email shortly. This is a free service.</p>`
            });
        } else {
             await sendEmail({
                to: email,
                subject: `We've Received Your Tuning Request for ${vehicle}`,
                html: `<h1>Request Received!</h1><p>Thank you, ${name}. We have received your request for the "<strong>${service}</strong>" service for your <strong>${vehicle}</strong>. We will review your file and send you a quote shortly.</p>`
            });
        }

        return { success: true };
    } catch (error) {
        console.error("Failed to create tuning request:", error);
        return { success: false, error: "An unexpected server error occurred." };
    }
}


export async function updateRequestStatus(requestId: number, status: TuningRequest['status'], price?: number): Promise<{ success: boolean; error?: string }> {
    try {
        // Fetch the request to get client email for notification
        const [rows] = await db.execute('SELECT email, name, vehicle, service FROM tuning_requests WHERE id = ?', [requestId]);
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
            const paypalEmail = 'lili912009@live.com';
            const itemName = `ECU Tuning: ${request.service} for ${request.vehicle}`;
            const paymentLink = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${encodeURIComponent(paypalEmail)}&item_name=${encodeURIComponent(itemName)}&amount=${price.toFixed(2)}&currency_code=USD&no_shipping=1`;

            await sendEmail({
                to: request.email,
                subject: `Your Quote for ${request.vehicle} Tuning`,
                html: `
                    <h1>Hello ${request.name},</h1>
                    <p>Your quote for the service "<strong>${request.service}</strong>" on your <strong>${request.vehicle}</strong> is ready.</p>
                    <p>The total price is <strong>$${price.toFixed(2)} USD</strong>.</p>
                    <p>To proceed, please complete the payment using the secure link below:</p>
                    <p style="text-align:center;">
                        <a href="${paymentLink}" target="_blank" style="display:inline-block;padding:12px 24px;background-color:#0070ba;color:white;text-decoration:none;border-radius:5px;font-size:16px;">Pay Now with PayPal</a>
                    </p>
                    <p>Once payment is confirmed, we will begin working on your file and notify you upon completion.</p>
                    <p>Thank you,<br/>Max-Drive-Services</p>
                `
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
