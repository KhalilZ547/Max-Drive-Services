'use server';
/**
 * @fileOverview A smart garage assistant that can answer questions and help users take action.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { MessageData, Part } from 'genkit';

// A mapping from natural language service names to the IDs used in the appointment form.
const serviceIdMap: Record<string, string> = {
    'oil change': 'oil-change',
    'brakes': 'brake-repair',
    'brake repair': 'brake-repair',
    'engine diagnostic': 'engine-diagnostic',
    'ecu solution': 'ecu-solutions',
    'ecu tuning': 'ecu-solutions',
    'other': 'other',
};

const bookAppointmentTool = ai.defineTool(
  {
    name: 'bookAppointment',
    description: 'Use this tool to book a service appointment for the user. Ask for clarification if the service is not clear.',
    inputSchema: z.object({
      service: z.string().describe('The specific service to book. Should be one of: oil change, brake repair, engine diagnostic, ecu solution, or other.'),
    }),
    outputSchema: z.object({
        serviceId: z.string(),
        serviceName: z.string(),
    }),
  },
  async (input) => {
    const serviceKey = input.service.toLowerCase();
    const serviceId = serviceIdMap[serviceKey] || 'other';
    return {
        serviceId: serviceId,
        serviceName: input.service,
    };
  }
);

const assistantPrompt = ai.definePrompt({
    name: 'garageAssistantPrompt',
    model: 'googleai/gemini-2.0-flash',
    tools: [bookAppointmentTool],
    system: `You are a friendly and helpful garage assistant for a company called Max-Drive-Services. Your goal is to answer user questions about car services and actively help them book appointments using the provided tools.

    - Be concise and friendly in your responses.
    - When a user expresses intent to book a service (e.g., "I need an oil change," "Can I schedule a brake check?"), you MUST use the bookAppointment tool.
    - If the user's request is vague (e.g., "I need service"), ask for clarification before using the tool (e.g., "What kind of service are you looking for?").
    - Do not make up information about pricing or availability. Guide them to book an appointment to get specific details.
    - The available services are: oil change, brake repair, engine diagnostic, and ECU solutions.
    `,
});

export async function invokeGarageAssistant(
  prevState: Part | null,
  formData: FormData
): Promise<Part> {
  const message = formData.get('message') as string;
  const history = JSON.parse(formData.get('history') as string) as MessageData[];

  const response = await assistantPrompt({
    history: history,
    prompt: message,
  });

  return response.output!.message.content[0];
}