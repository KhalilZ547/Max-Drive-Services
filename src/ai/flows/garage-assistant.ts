
'use server';

/**
 * @fileOverview A smart garage assistant that can answer questions.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { MessageData, Part } from 'genkit';

const assistantPrompt = ai.definePrompt({
    name: 'garageAssistantPrompt',
    model: 'googleai/gemini-2.0-flash',
    system: `You are a friendly and helpful garage assistant for a company called Max-Drive-Services. Your goal is to answer user questions about car services.

    - Be concise and friendly in your responses.
    - Do not make up information about pricing or availability.
    - The available services are: oil change, brake repair, engine diagnostic, and ECU solutions.
    `,
});

export async function invokeGarageAssistant(
  prevState: Part | null,
  { message, history }: { message: string; history: MessageData[] }
): Promise<Part> {
  const { output } = await assistantPrompt({
    history: history,
    prompt: message,
  });

  if (!output || !output.message.content.length) {
    throw new Error('AI assistant did not return a valid response.');
  }

  return output.message.content[0];
}
