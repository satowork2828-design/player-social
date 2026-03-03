
'use server';
/**
 * @fileOverview This flow compares two soccer players based on their stats and attributes.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PlayerDataSchema = z.object({
  name: z.string(),
  position: z.string(),
  rating: z.number(),
  stats: z.object({
    goals: z.number(),
    assists: z.number(),
    matches: z.number(),
  }),
  attributes: z.object({
    pace: z.number(),
    shooting: z.number(),
    passing: z.number(),
    dribbling: z.number(),
    defending: z.number(),
    physical: z.number(),
  }),
});

const ComparisonInputSchema = z.object({
  player1: PlayerDataSchema,
  player2: PlayerDataSchema,
});

export type ComparisonInput = z.infer<typeof ComparisonInputSchema>;

const ComparisonOutputSchema = z.object({
  analysis: z.string().describe('A detailed comparison scouting report.'),
  winner: z.string().describe('The name of the player who has the slight edge in current form or technical profile.'),
  keyDifferences: z.array(z.string()).describe('List of 3-5 major differences between the two.'),
});

export type ComparisonOutput = z.infer<typeof ComparisonOutputSchema>;

const comparisonPrompt = ai.definePrompt({
  name: 'comparePlayersPrompt',
  input: {schema: ComparisonInputSchema},
  output: {schema: ComparisonOutputSchema},
  prompt: `You are an elite tactical analyst and head scout for a top-tier European club.
Compare the following two players based on their technical attributes and statistics.

Player 1: {{{player1.name}}} ({{{player1.position}}}, Rating: {{{player1.rating}}})
Stats: Goals: {{{player1.stats.goals}}}, Assists: {{{player1.stats.assists}}}, Matches: {{{player1.stats.matches}}}
Attributes: Pace: {{{player1.attributes.pace}}}, Shooting: {{{player1.attributes.shooting}}}, Passing: {{{player1.attributes.passing}}}, Dribbling: {{{player1.attributes.dribbling}}}, Defending: {{{player1.attributes.defending}}}, Physical: {{{player1.attributes.physical}}}

Player 2: {{{player2.name}}} ({{{player2.position}}}, Rating: {{{player2.rating}}})
Stats: Goals: {{{player2.stats.goals}}}, Assists: {{{player2.stats.assists}}}, Matches: {{{player2.stats.matches}}}
Attributes: Pace: {{{player2.attributes.pace}}}, Shooting: {{{player2.attributes.shooting}}}, Passing: {{{player2.attributes.passing}}}, Dribbling: {{{player2.attributes.dribbling}}}, Defending: {{{player2.attributes.defending}}}, Physical: {{{player2.attributes.physical}}}

Provide a professional scouting report comparing their masteries, impact on play, and who offers better tactical flexibility.`,
});

export async function generatePlayerComparison(input: ComparisonInput): Promise<ComparisonOutput> {
  const {output} = await comparisonPrompt(input);
  return output!;
}
