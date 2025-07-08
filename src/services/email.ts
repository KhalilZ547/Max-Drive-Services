
'use server';

import { Resend } from 'resend';

type EmailPayload = {
    to: string;
    subject: string;
    html: string;
};

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ to, subject, html }: EmailPayload): Promise<{ success: boolean; message: string }> {
    if (!process.env.RESEND_API_KEY) {
        console.error("RESEND_API_KEY is not set. Email sending is now mocked.");
        console.log("--- Sending Email (Mock) ---");
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log("Body is logged in the browser console where the form was submitted.");
        console.log("--------------------------");
        return { success: true, message: 'Email sent successfully (mocked as API key is missing).' };
    }
    
    try {
        const { data, error } = await resend.emails.send({
            // IMPORTANT: This 'from' address must be a domain you have verified with Resend.
            // Using 'onboarding@resend.dev' is a special test address that works for development.
            from: 'Max Drive Services <onboarding@resend.dev>',
            to,
            subject,
            html,
        });

        if (error) {
            console.error('Error sending email:', error);
            return { success: false, message: 'Failed to send email.' };
        }
        
        return { success: true, message: 'Email sent successfully.' };
    } catch (error) {
        console.error('Exception sending email:', error);
        return { success: false, message: 'Failed to send email.' };
    }
}
