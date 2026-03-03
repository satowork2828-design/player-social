'use server';
/**
 * @fileOverview This file implements a Genkit flow for summarizing multiple player reviews.
 * It takes an array of review texts as input and generates a concise summary of the overall sentiment and key discussion points.
 *
 * - generatePlayerReviewSummary - A function to trigger the AI review summary generation.
 * - PlayerReviewSummaryInput - The input type for the summary function.
 * - PlayerReviewSummaryOutput - The return type for the summary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

/**
 * Defines the input schema for the player review summary flow.
 * It expects an array of strings, where each string is a player review.
 */
const PlayerReviewSummaryInputSchema = z.object({
  reviews: z.array(z.string()).describe('An array of player review articles.'),
});
export type PlayerReviewSummaryInput = z.infer<typeof PlayerReviewSummaryInputSchema>;

/**
 * Defines the output schema for the player review summary flow.
 * It returns a single string containing the generated summary.
 */
const PlayerReviewSummaryOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A concise summary of the key sentiment and discussion points from the reviews.'
    ),
});
export type PlayerReviewSummaryOutput = z.infer<
  typeof PlayerReviewSummaryOutputSchema
>;

/**
 * Defines the prompt for summarizing player reviews.
 * It instructs the AI to generate a concise summary from the provided reviews,
 * focusing on overall sentiment and key discussion points.
 */
const summarizeReviewsPrompt = ai.definePrompt({
  name: 'summarizePlayerReviewsPrompt',
  input: {schema: PlayerReviewSummaryInputSchema},
  output: {schema: PlayerReviewSummaryOutputSchema},
  prompt: `You are an AI assistant tasked with summarizing multiple player reviews for a soccer player.
Given the following reviews, generate a concise summary (around 2-3 paragraphs) that captures the overall sentiment and highlights the key discussion points mentioned across all reviews.

Focus on:
- Overall sentiment (positive, negative, or mixed).
- Recurring themes about the player's performance, skills, attitude, etc.
- Notable strengths or weaknesses consistently mentioned.

Reviews:
{{#each reviews}}
- {{{this}}}
{{/each}}`,
});

/**
 * Defines the Genkit flow for generating a player review summary.
 * This flow takes an array of reviews as input, calls the AI prompt to summarize them,
 * and returns the generated summary.
 */
const playerReviewSummaryFlow = ai.defineFlow(
  {
    name: 'playerReviewSummaryFlow',
    inputSchema: PlayerReviewSummaryInputSchema,
    outputSchema: PlayerReviewSummaryOutputSchema,
  },
  async (input) => {
    const {output} = await summarizeReviewsPrompt(input);
    return output!;
  }
);

/**
 * Wrapper function to execute the player review summary Genkit flow.
 * @param input The input containing the array of player reviews.
 * @returns A promise that resolves to the generated summary.
 */
export async function generatePlayerReviewSummary(
  input: PlayerReviewSummaryInput
): Promise<PlayerReviewSummaryOutput> {
  return playerReviewSummaryFlow(input);
}
