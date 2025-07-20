'use server';

import { config } from 'dotenv';
config();

/**
 * @fileOverview This file acts as a server-side entry point for client components
 * to invoke Genkit flows. It ensures environment variables are loaded via dotenv.
 */

import { invokeGarageAssistant as garageAssistant } from '@/ai/flows/garage-assistant';
import type { MessageData, Part } from 'genkit';

export async function invokeGarageAssistant(
  prevState: Part | null,
  { message, history }: { message: string; history: MessageData[] }
): Promise<Part> {
  return garageAssistant(prevState, { message, history });
}
