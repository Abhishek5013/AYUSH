'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getQuiz, saveUserAnswers } from '@/lib/quiz-store';
import type { Quiz, Question as QuestionType, UserAnswers } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, ArrowRight, Check, Send } from 'lucide-react';
import { PageHeader } from '../common/page-header';
import { Skeleton } from '../ui/skeleton';

function Question({
  question,
  userAnswer,
  onAnswerChange,
}: {
  question: QuestionType;
  userAnswer: string | undefined;
  onAnswerChange: (answer: string) => void;
}) {
  return (
    <div>
      <h3 className="text-lg font-semibold md:text-xl">{question.question}</h3>
      <div className="mt-4 space-y-4">
        {question.type === 'multiple-choice' && (
          <RadioGroup value={userAnswer} onValueChange={onAnswerChange}>
            {question.answers.map((answer, i) => (
              <div key={i} className="flex items-center space-x-2">
                <RadioGroupItem value={answer} id={`q-option-${i}`} />
                <Label htmlFor={`q-option-${i}`} className="text-base cursor-pointer">
                  {answer}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}
        {question.type === 'true-false' && (
          <RadioGroup value={userAnswer} onValueChange={onAnswerChange}>
            {['True', 'False'].map((answer, i) => (
              <div key={i} className="flex items-center space-x-2">
                <RadioGroupItem value={answer} id={`q-option-${i}`} />
                <Label htmlFor={`q-option-${i}`} className="text-base cursor-pointer">
                  {answer}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}
        {question.type === 'fill-in-the-blanks' && (
          <Input
            value={userAnswer || ''}
            onChange={(e) => onAnswerChange(e.target.value)}
            placeholder="Type your answer here..."
          />
        )}
      </div>
    </div>
  );
}

export function QuizTaker({ quizId }: { quizId: string }) {
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const quizData = getQuiz(quizId);
    if (quizData) {
      setQuiz(quizData);
    }
    setIsLoading(false);
  }, [quizId]);

  const handleAnswerChange = (answer: string) => {
    setUserAnswers((prev) => ({ ...prev, [currentQuestionIndex]: answer }));
  };

  const handleNext = () => {
    if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    saveUserAnswers(quizId, userAnswers);
    router.push(`/quiz/${quizId}/results`);
  };

  if (isLoading) {
    return (
        <div className="p-6">
            <Skeleton className="h-10 w-1/2 mb-2" />
            <Skeleton className="h-6 w-3/4 mb-8" />
            <Card>
                <CardHeader><Skeleton className="h-8 w-full" /></CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-10 w-full mt-4" />
                </CardContent>
                <CardFooter>
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-24 ml-auto" />
                </CardFooter>
            </Card>
        </div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex items-center justify-center h-full">
        <Alert variant="destructive" className="max-w-md">
          <AlertTitle>Quiz Not Found</AlertTitle>
          <AlertDescription>
            The quiz you are looking for does not exist or has expired. Please try creating a new one.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  return (
    <div className="flex flex-col h-full">
        <PageHeader title={`Quiz: ${quiz.topic}`} description="Answer the questions to the best of your ability." />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="max-w-3xl mx-auto">
                <Progress value={progress} className="mb-4" />
                <Card className="shadow-lg animate-in fade-in-50 duration-500">
                    <CardHeader>
                        <CardTitle>
                        Question {currentQuestionIndex + 1} of {quiz.questions.length}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="min-h-[200px]">
                        <Question
                        question={currentQuestion}
                        userAnswer={userAnswers[currentQuestionIndex]}
                        onAnswerChange={handleAnswerChange}
                        />
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button variant="outline" onClick={handlePrev} disabled={currentQuestionIndex === 0}>
                        <ArrowLeft /> Previous
                        </Button>
                        {isLastQuestion ? (
                        <Button onClick={handleSubmit} variant="default">
                            Submit Quiz <Send />
                        </Button>
                        ) : (
                        <Button onClick={handleNext}>
                            Next <ArrowRight />
                        </Button>
                        )}
                    </CardFooter>
                </Card>
            </div>
        </main>
    </div>
  );
}
