
'use server';

import { Resend } from 'resend';

type EmailPayload = {
    to: string;
    subject: string;
    html: string;
};

// Initialize Resend with the API key from environment variables.
// This is secure and allows you to change keys without changing code.
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ to, subject, html }: EmailPayload): Promise<{ success: boolean; message: string }> {
    // If the API key is not provided, we fall back to a mock mode.
    // This is useful for local development without needing a real key.
    if (!process.env.RESEND_API_KEY) {
        console.warn("RESEND_API_KEY is not set. Email sending is mocked.");
        console.log("--- Mock Email Sent ---");
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log(`Body (HTML):`, html);
        console.log("-----------------------");
        return { success: true, message: 'Email sent successfully (mocked).' };
    }
    
    try {
        const { data, error } = await resend.emails.send({
            // VERY IMPORTANT FOR PRODUCTION:
            // 1. You must verify a domain with your Resend account (e.g., 'maxdrive.com').
            // 2. The 'from' address must use that verified domain.
            // Using 'onboarding@resend.dev' works for testing but emails will be from Resend.
            // Replace 'your-verified-domain.com' with your actual domain.
            from: 'Max Drive Services <noreply@your-verified-domain.com>',
            to,
            subject,
            html,
        });

        if (error) {
            console.error('Error sending email via Resend:', error);
            return { success: false, message: 'Failed to send email.' };
        }
        
        console.log('Email sent successfully:', data);
        return { success: true, message: 'Email sent successfully.' };
    } catch (exception) {
        console.error('An exception occurred while sending email:', exception);
        return { success: false, message: 'An unexpected error occurred while sending the email.' };
    }
}
