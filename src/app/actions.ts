
'use server';

import { config } from 'dotenv';
config();

import { answerGarageQuery, AnswerGarageQueryInput, AnswerGarageQueryOutput } from '@/ai/flows/answer-garage-queries';

/**
 * @fileOverview This file acts as a server-side entry point for client components
 * to invoke Genkit flows. It ensures environment variables are loaded via dotenv.
 */

export async function askGarageExpert(input: AnswerGarageQueryInput): Promise<AnswerGarageQueryOutput> {
    return await answerGarageQuery(input);
}

// All functions related to the garage assistant have been removed to resolve errors.
