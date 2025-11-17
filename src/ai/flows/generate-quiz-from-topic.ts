'use server';

/**
 * @fileOverview Generates a quiz on a given topic.
 *
 * - generateQuiz - A function that generates a quiz.
 * - GenerateQuizInput - The input type for the generateQuiz function.
 * - GenerateQuizOutput - The return type for the generateQuiz function.
 */

import {ai} from '@/ai/genkit';
import {Quiz} from '@/types';
import {z} from 'genkit';
import {v4 as uuidv4} from 'uuid';

const GenerateQuizInputSchema = z.object({
  topic: z.string().describe('The topic of the quiz.'),
  numQuestions: z.number().min(1).max(20).default(10).describe('The number of questions to generate.'),
});
export type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;

const QuestionSchema = z.object({
  question: z.string().describe('The text of the question.'),
  type: z.enum(['multiple-choice', 'true-false', 'fill-in-the-blanks']).describe('The type of question.'),
  answers: z.array(z.string()).describe('The possible answers to the question. For true-false, should be [\'True\', \'False\']. For fill-in-the-blanks, it will be an empty array.'),
  correctAnswer: z.string().describe('The correct answer to the question.'),
});

const QuizDataSchema = z.object({
  topic: z.string().describe('The topic of the quiz.'),
  questions: z.array(QuestionSchema).describe('A list of questions for the quiz.'),
});

const GenerateQuizOutputSchema = QuizDataSchema.extend({
  quizId: z.string().describe('A unique ID for the quiz.'),
});
export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;

export async function generateQuiz(input: GenerateQuizInput): Promise<GenerateQuizOutput> {
  const quiz = await generateQuizFlow(input);
  return {
    ...quiz,
    quizId: uuidv4(),
  };
}

const generateQuizPrompt = ai.definePrompt({
  name: 'generateQuizPrompt',
  input: {schema: GenerateQuizInputSchema},
  output: {schema: QuizDataSchema},
  prompt: `You are an expert quiz creator. Generate a {{numQuestions}}-question quiz about {{topic}}.
The quiz should contain a mix of multiple-choice, true/false, and fill-in-the-blank questions.
For multiple-choice questions, provide 4 options.
For true/false, the answers should be 'True' or 'False'.
For fill-in-the-blanks, do not provide any answer options in the 'answers' array.
Ensure every question has a correct answer.`,
});

const generateQuizFlow = ai.defineFlow(
  {
    name: 'generateQuizFlow',
    inputSchema: GenerateQuizInputSchema,
    outputSchema: QuizDataSchema,
  },
  async input => {
    const {output} = await generateQuizPrompt(input);
    return output!;
  }
);
