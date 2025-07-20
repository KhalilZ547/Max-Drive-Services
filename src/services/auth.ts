
'use server';

import db from '@/lib/db';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { sendEmail } from '@/services/email';

// Schema for new user signup
const SignupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

// Schema for user login
const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

/**
 * Handles new user registration.
 */
export async function signupUser(data: unknown) {
  const validation = SignupSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: 'Invalid input data.' };
  }
  
  const { name, email, password } = validation.data;
  
  try {
    // Check if user already exists
    const [existing] = await db.execute('SELECT id FROM clients WHERE email = ?', [email]);
    if ((existing as any[]).length > 0) {
      return { success: false, error: 'A user with this email address already exists.' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user with 'client' role by default
    await db.execute(
      'INSERT INTO clients (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, 'client']
    );
    
    // In a real app, you would generate a verification link/token and send it.
    // For now, we'll just send a welcome email.
    await sendEmail({
      to: email,
      subject: "Welcome to Max-Drive-Services!",
      html: `<h1>Welcome, ${name}!</h1><p>Your account has been created successfully. You can now log in.</p>`
    });

    return { success: true };
  } catch (error) {
    console.error('Signup Error:', error);
    return { success: false, error: 'An unexpected server error occurred.' };
  }
}

/**
 * Handles user login.
 */
export async function loginUser(data: unknown) {
  const validation = LoginSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: 'Invalid input data.' };
  }

  const { email, password } = validation.data;

  try {
    const [rows] = await db.execute('SELECT id, password, role FROM clients WHERE email = ?', [email]);
    const users = rows as any[];

    if (users.length === 0) {
      return { success: false, error: 'Invalid email or password.' };
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return { success: false, error: 'Invalid email or password.' };
    }
    
    // Return user info for client-side session
    return { 
      success: true, 
      user: { 
        id: user.id, 
        role: user.role 
      } 
    };

  } catch (error) {
    console.error('Login Error:', error);
    return { success: false, error: 'An unexpected server error occurred.' };
  }
}

/**
 * Mocks getting the ID of the currently logged-in user from client-side storage.
 * THIS IS A SIMPLIFICATION. In a production app, this would be handled by a server-side session.
 * @returns {Promise<string | null>} The user ID or null if not authenticated.
 */
export async function getUserId(): Promise<string | null> {
    // This function is now designed to be called from other server actions.
    // The actual user ID would be passed from the client, but for actions
    // that don't receive it, we need a way to get it.
    // In a real app with server-side sessions (e.g., NextAuth.js), you'd call a method like `getSession()`.
    // For now, we have to rely on a client-side lookup which means this function
    // isn't truly secure if called without context, but it fits our current architecture.
    // To make this work, we assume the "logged-in" user is our primary test user.
    return 'usr_4'; // Fallback to 'Karim Ben Ahmed' for server-only actions
}
