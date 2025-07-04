'use server';

/**
 * @fileOverview AI assistant for answering garage-related queries.
 *
 * - answerGarageQuery - A function that takes a user query and returns an answer.
 * - AnswerGarageQueryInput - The input type for the answerGarageQuery function.
 * - AnswerGarageQueryOutput - The return type for the answerGarageQuery function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerGarageQueryInputSchema = z.object({
  query: z.string().describe('The user query related to garage services.'),
});
export type AnswerGarageQueryInput = z.infer<typeof AnswerGarageQueryInputSchema>;

const AnswerGarageQueryOutputSchema = z.object({
  answer: z.string().describe('The answer to the user query.'),
});
export type AnswerGarageQueryOutput = z.infer<typeof AnswerGarageQueryOutputSchema>;

export async function answerGarageQuery(input: AnswerGarageQueryInput): Promise<AnswerGarageQueryOutput> {
  return answerGarageQueryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerGarageQueryPrompt',
  input: {schema: AnswerGarageQueryInputSchema},
  output: {schema: AnswerGarageQueryOutputSchema},
  prompt: `You are a helpful AI assistant specializing in answering questions about garage services.
  Use your knowledge to provide accurate and helpful answers to the following query:
  
  Query: {{{query}}}
  `,
});

const answerGarageQueryFlow = ai.defineFlow(
  {
    name: 'answerGarageQueryFlow',
    inputSchema: AnswerGarageQueryInputSchema,
    outputSchema: AnswerGarageQueryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
