'use server';

/**
 * @fileOverview AI-driven personalized feedback on quiz performance.
 *
 * - providePersonalizedFeedback - A function that provides personalized feedback on quiz performance.
 * - ProvidePersonalizedFeedbackInput - The input type for the providePersonalizedFeedback function.
 * - ProvidePersonalizedFeedbackOutput - The return type for the providePersonalizedFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProvidePersonalizedFeedbackInputSchema = z.object({
  quizTopic: z.string().describe('The topic of the quiz.'),
  userAnswers: z.record(z.string(), z.string()).describe('A map of question IDs to the user answers.'),
  correctAnswers: z.record(z.string(), z.string()).describe('A map of question IDs to the correct answers.'),
});
export type ProvidePersonalizedFeedbackInput = z.infer<
  typeof ProvidePersonalizedFeedbackInputSchema
>;

const ProvidePersonalizedFeedbackOutputSchema = z.object({
  feedback: z.string().describe('Personalized feedback on the user\'s quiz performance.'),
  suggestedAreasForImprovement: z
    .string()
    .describe('Suggested areas for the user to improve their understanding.'),
  externalSources: z.string().describe('External sources for the user to consult.'),
});
export type ProvidePersonalizedFeedbackOutput = z.infer<
  typeof ProvidePersonalizedFeedbackOutputSchema
>;

export async function providePersonalizedFeedback(
  input: ProvidePersonalizedFeedbackInput
): Promise<ProvidePersonalizedFeedbackOutput> {
  return providePersonalizedFeedbackFlow(input);
}

const providePersonalizedFeedbackPrompt = ai.definePrompt({
  name: 'providePersonalizedFeedbackPrompt',
  input: {schema: ProvidePersonalizedFeedbackInputSchema},
  output: {schema: ProvidePersonalizedFeedbackOutputSchema},
  prompt: `You are an AI-driven personalized feedback provider for quizzes.

You will receive the quiz topic, the user\'s answers, and the correct answers.
Based on this information, you will provide personalized feedback to the user, suggest areas for improvement, and recommend external sources for them to consult.

Quiz Topic: {{{quizTopic}}}
User Answers: {{{userAnswers}}}
Correct Answers: {{{correctAnswers}}}

Personalized Feedback:
`,
});

const providePersonalizedFeedbackFlow = ai.defineFlow(
  {
    name: 'providePersonalizedFeedbackFlow',
    inputSchema: ProvidePersonalizedFeedbackInputSchema,
    outputSchema: ProvidePersonalizedFeedbackOutputSchema,
  },
  async input => {
    const {output} = await providePersonalizedFeedbackPrompt(input);
    return output!;
  }
);
