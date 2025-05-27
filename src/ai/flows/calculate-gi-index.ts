'use server';
/**
 * @fileOverview Calculates the Glycemic Index (GI) of a food item.
 *
 * - calculateGiIndex - A function that calculates the GI index of a food item.
 * - CalculateGiIndexInput - The input type for the calculateGiIndex function.
 * - CalculateGiIndexOutput - The return type for the calculateGiIndex function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CalculateGiIndexInputSchema = z.object({
  foodItem: z.string().describe('The name of the food item to calculate the GI index for.'),
});
export type CalculateGiIndexInput = z.infer<typeof CalculateGiIndexInputSchema>;

const CalculateGiIndexOutputSchema = z.object({
  giIndex: z.number().describe('The estimated Glycemic Index (GI) of the food item.'),
  explanation: z.string().describe('An explanation of how the GI index was calculated.'),
});
export type CalculateGiIndexOutput = z.infer<typeof CalculateGiIndexOutputSchema>;

export async function calculateGiIndex(input: CalculateGiIndexInput): Promise<CalculateGiIndexOutput> {
  return calculateGiIndexFlow(input);
}

const prompt = ai.definePrompt({
  name: 'calculateGiIndexPrompt',
  input: {schema: CalculateGiIndexInputSchema},
  output: {schema: CalculateGiIndexOutputSchema},
  prompt: `You are an expert nutritionist. Calculate the Glycemic Index (GI) for the following food item, providing an estimate based on available data. Also, provide a brief explanation of how you arrived at the GI index.

Food Item: {{{foodItem}}}
`,
});

const calculateGiIndexFlow = ai.defineFlow(
  {
    name: 'calculateGiIndexFlow',
    inputSchema: CalculateGiIndexInputSchema,
    outputSchema: CalculateGiIndexOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
