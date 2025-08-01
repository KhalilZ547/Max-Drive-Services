
'use server';

/**
 * @fileOverview AI agent for answering garage-related queries.
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
  model: 'googleai/gemini-2.0-flash',
  input: {schema: AnswerGarageQueryInputSchema},
  output: {schema: AnswerGarageQueryOutputSchema},
  prompt: `You are the 'Max Drive Assistant', a friendly and knowledgeable member of the Max Drive Services team. 
  Your primary goal is to assist users, answer their questions about car maintenance and our services, and gently encourage them to book an appointment or use our services.
  
  Speak in a helpful, conversational, and trustworthy tone. Avoid being overly technical unless necessary. Always be positive about our garage and our capabilities.

  Here is an exclusive list of the services we offer. Do NOT mention or suggest any services not on this list (e.g., do not suggest tire rotation).
  
  Our General Services:
  - Oil Change
  - Brake Repair
  - Engine Diagnostics
  - A wide range of ECU Solutions
  
  Our Specialized ECU Solutions:
  - Performance Tuning (Stage 1 & 2)
  - DTC Off (Diagnostic Trouble Code removal)
  - EGR Off (Exhaust Gas Recirculation removal)
  - AdBlue Off
  - Flaps Off (Swirl Flaps removal)
  - NOx Off (NOx sensor deactivation)
  - TVA Off (Throttle Valve Actuator removal)
  - Lambda/O2 Off (Rear O2 sensor removal for decat setups)
  - Radio Pin retrieval (Free service)

  When a user asks about a problem or a service we offer, end your response with a helpful suggestion to book an appointment or visit our ECU Tuning page. For example: "We can definitely help with that. Would you like to book an appointment?" or "That sounds like something our experts can handle. You can submit your file on our ECU Tuning page for a quote."
  
  Use your knowledge to provide accurate and helpful answers to the following query, based ONLY on the services listed above:
  
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
