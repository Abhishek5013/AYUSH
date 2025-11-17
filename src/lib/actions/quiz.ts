'use server';

import { generateQuiz } from '@/ai/flows/generate-quiz-from-topic';
import { providePersonalizedFeedback } from '@/ai/flows/provide-personalized-feedback';
import { Quiz } from '@/types';
import { z } from 'zod';

const quizSchema = z.object({
  topic: z.string().min(3, 'Topic must be at least 3 characters long.'),
  userName: z.string().min(2, 'Name must be at least 2 characters long.'),
});

interface GenerateQuizState {
  quiz?: Quiz;
  error?: string;
  userName?: string;
}

export async function generateQuizAction(
  prevState: GenerateQuizState,
  formData: FormData
): Promise<GenerateQuizState> {
  try {
    const validation = quizSchema.safeParse({
      topic: formData.get('topic'),
      userName: formData.get('userName'),
    });

    if (!validation.success) {
      return { error: validation.error.errors.map((e) => e.message).join(', ') };
    }

    const { topic, userName } = validation.data;

    const output = await generateQuiz({ topic, numQuestions: 10 });
    
    if (!output || !output.questions || output.questions.length === 0) {
      return { error: 'Failed to generate a quiz. The topic might be too specific or invalid. Please try another topic.' };
    }

    return { quiz: { ...output, userName } as Quiz, userName };
  } catch (e) {
    console.error(e);
    return { error: 'An unexpected error occurred. Please try again.' };
  }
}

interface FeedbackState {
    feedback?: {
        feedback: string;
        suggestedAreasForImprovement: string;
        externalSources: string;
    };
    error?: string;
}

export async function provideFeedbackAction(
    quizTopic: string,
    userAnswers: Record<string, string>,
    correctAnswers: Record<string, string>
): Promise<FeedbackState> {
    try {
        const feedback = await providePersonalizedFeedback({
            quizTopic,
            userAnswers,
            correctAnswers,
        });
        return { feedback };
    } catch (e) {
        console.error(e);
        return { error: 'Failed to generate feedback.' };
    }
}
