'use client';

import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { generateQuizAction } from '@/lib/actions/quiz';
import { useToast } from '@/hooks/use-toast';
import { saveQuiz } from '@/lib/quiz-store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Label } from '../ui/label';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        'Generate Quiz'
      )}
    </Button>
  );
}

export function QuizCreationForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [state, formAction] = useFormState(generateQuizAction, {});

  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.error,
      });
    }
    if (state.quiz) {
      toast({
        title: 'Success!',
        description: `Your quiz on "${state.quiz.topic}" is ready.`,
      });
      saveQuiz(state.quiz);
      router.push(`/quiz/${state.quiz.quizId}`);
    }
  }, [state, router, toast]);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <Label htmlFor="topic" className="text-muted-foreground">Quiz Topic</Label>
        <Input
          id="topic"
          name="topic"
          placeholder="e.g., Roman History, Quantum Physics, React Hooks"
          required
          className="mt-1"
        />
      </div>
      <SubmitButton />
    </form>
  );
}
