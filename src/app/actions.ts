
'use server';

import { garageAssistantFlow } from '@/ai/flows/garage-assistant';
import { MessageData, Part } from 'genkit';

export async function invokeGarageAssistant(input: { history: MessageData[], message: string }): Promise<Part> {
  return garageAssistantFlow(input);
}
