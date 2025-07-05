'use server';

/**
 * @fileOverview This file defines a Genkit flow to generate a summarized list of services offered by Max-Drive-Services.
 *
 * - generateServiceSummary - A function that generates a summary of the services offered.
 * - GenerateServiceSummaryInput - The input type for the generateServiceSummary function.
 * - GenerateServiceSummaryOutput - The return type for the generateServiceSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateServiceSummaryInputSchema = z.object({
  query: z
    .string()
    .describe("The user's prompt asking for a summary of services offered."),
});
export type GenerateServiceSummaryInput = z.infer<typeof GenerateServiceSummaryInputSchema>;

const GenerateServiceSummaryOutputSchema = z.object({
  summary: z.string().describe('A summarized list of services offered.'),
});
export type GenerateServiceSummaryOutput = z.infer<
  typeof GenerateServiceSummaryOutputSchema
>;

export async function generateServiceSummary(
  input: GenerateServiceSummaryInput
): Promise<GenerateServiceSummaryOutput> {
  return generateServiceSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateServiceSummaryPrompt',
  model: 'googleai/gemini-2.0-flash',
  input: {schema: GenerateServiceSummaryInputSchema},
  output: {schema: GenerateServiceSummaryOutputSchema},
  prompt: `You are Max, an AI assistant for Max-Drive-Services, a garage that offers car services.
  A user has asked for a summary of services offered.
  Generate a summarized list of services offered in response to the following query:

  Query: {{{query}}}

  Respond in a professional and concise manner.`,
});

const generateServiceSummaryFlow = ai.defineFlow(
  {
    name: 'generateServiceSummaryFlow',
    inputSchema: GenerateServiceSummaryInputSchema,
    outputSchema: GenerateServiceSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
