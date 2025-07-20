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
  formData: FormData
): Promise<Part> {
  const message = formData.get('message') as string;
  const historyString = formData.get('history') as string;
  const history = JSON.parse(historyString || '[]') as MessageData[];

  return garageAssistant(prevState, { message, history });
}
