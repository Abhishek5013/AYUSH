'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { getQuiz, getUserAnswers, saveQuizResult } from '@/lib/quiz-store';
import { provideFeedbackAction } from '@/lib/actions/quiz';
import type { Quiz, UserAnswers, QuizResult } from '@/types';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle2, XCircle, Lightbulb, GraduationCap, ExternalLink, Repeat } from 'lucide-react';
import { PageHeader } from '../common/page-header';
import { Separator } from '../ui/separator';

type FeedbackState = {
    feedback?: {
        feedback: string;
        suggestedAreasForImprovement: string;
        externalSources: string;
    };
    error?: string;
};

const LoadingSkeleton = () => (
    <div className="p-6 space-y-8">
        <Skeleton className="h-10 w-3/4 mb-4" />
        <Card>
            <CardHeader><Skeleton className="h-8 w-1/3" /></CardHeader>
            <CardContent><Skeleton className="h-20 w-full" /></CardContent>
        </Card>
        <Card>
            <CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-5/6" />
            </CardContent>
        </Card>
    </div>
);


export function QuizResultsDisplay({ quizId }: { quizId: string }) {
    const router = useRouter();
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [userAnswers, setUserAnswers] = useState<UserAnswers | null>(null);
    const [feedbackState, setFeedbackState] = useState<FeedbackState>({});
    const [isFeedbackLoading, setIsFeedbackLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    const { score, totalQuestions, correctAnswersMap, userAnswersMap } = useMemo(() => {
        if (!quiz || !userAnswers) {
            return { score: 0, totalQuestions: 0, correctAnswersMap: {}, userAnswersMap: {} };
        }

        let score = 0;
        const correctAnswersMap: Record<string, string> = {};
        const userAnswersMap: Record<string, string> = {};
        
        quiz.questions.forEach((q, index) => {
            const isCorrect = userAnswers[index]?.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
            if (isCorrect) {
                score++;
            }
            correctAnswersMap[q.question] = q.correctAnswer;
            userAnswersMap[q.question] = userAnswers[index] || "Not answered";
        });

        return { score, totalQuestions: quiz.questions.length, correctAnswersMap, userAnswersMap };
    }, [quiz, userAnswers]);


    useEffect(() => {
        const quizData = getQuiz(quizId);
        const answersData = getUserAnswers(quizId);

        if (quizData && answersData) {
            setQuiz(quizData);
            setUserAnswers(answersData);

            if (quizData.userName) {
                const resultToSave: QuizResult = {
                    quizId: quizData.quizId,
                    topic: quizData.topic,
                    score: 0, // temp score
                    totalQuestions: quizData.questions.length,
                    date: new Date().toISOString(),
                    correctAnswers: {},
                    userAnswers: answersData,
                    userName: quizData.userName,
                };
                
                let calculatedScore = 0;
                const correctAnsw: Record<number, string> = {};
                quizData.questions.forEach((q, i) => {
                    const isCorrect = answersData[i]?.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
                    if (isCorrect) calculatedScore++;
                    correctAnsw[i] = q.correctAnswer;
                });

                resultToSave.score = calculatedScore;
                resultToSave.correctAnswers = correctAnsw;
                
                saveQuizResult(resultToSave);
            }

        }
        setIsLoading(false);
    }, [quizId]);

    useEffect(() => {
        if (quiz && userAnswers) {
            provideFeedbackAction(quiz.topic, userAnswersMap, correctAnswersMap)
                .then(setFeedbackState)
                .finally(() => setIsFeedbackLoading(false));
        }
    }, [quiz, userAnswers, correctAnswersMap, userAnswersMap]);
    
    if (isLoading) {
        return <LoadingSkeleton />;
    }

    if (!quiz || !userAnswers) {
        return (
            <div className="flex items-center justify-center h-full">
            <Alert variant="destructive" className="max-w-md">
                <AlertTitle>Result Data Not Found</AlertTitle>
                <AlertDescription>
                Could not find the data for this quiz result. Please try taking the quiz again.
                </AlertDescription>
            </Alert>
            </div>
        );
    }
    
    const scorePercentage = Math.round((score / totalQuestions) * 100);

    return (
        <div className="flex flex-col h-full">
            <PageHeader title={`Results for: ${quiz.topic}`} description={`Here's how ${quiz.userName || 'you'} did. Check out your personalized feedback below.`} />
            
            <main className="flex-1 overflow-y-auto p-4 md:p-6">
                <div className="max-w-4xl mx-auto space-y-6">
                    <Card className="bg-gradient-to-br from-primary/80 to-primary text-primary-foreground">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><GraduationCap /> Your Score</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <p className="text-6xl font-bold">{scorePercentage}%</p>
                            <p className="text-lg opacity-90">({score} out of {totalQuestions} correct)</p>
                        </CardContent>
                    </Card>

                    {isFeedbackLoading ? (
                        <Card><CardContent className="p-6"><Skeleton className="h-32 w-full" /></CardContent></Card>
                    ) : feedbackState.feedback ? (
                         <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Lightbulb /> AI-Powered Feedback</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-lg">Personalized Feedback</h3>
                                    <p className="text-muted-foreground">{feedbackState.feedback.feedback}</p>
                                </div>
                                <Separator />
                                <div>
                                    <h3 className="font-semibold text-lg">Suggested Areas for Improvement</h3>
                                    <p className="text-muted-foreground">{feedbackState.feedback.suggestedAreasForImprovement}</p>
                                </div>
                                <Separator />
                                <div>
                                    <h3 className="font-semibold text-lg flex items-center gap-2"><ExternalLink size={18}/> External Resources</h3>
                                    <p className="text-muted-foreground">{feedbackState.feedback.externalSources}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Alert variant="destructive">
                            <AlertTitle>Feedback Error</AlertTitle>
                            <AlertDescription>{feedbackState.error || 'Could not generate feedback at this time.'}</AlertDescription>
                        </Alert>
                    )}

                    <Card>
                        <CardHeader>
                            <CardTitle>Question Breakdown</CardTitle>
                            <CardDescription>Review your answers below.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-4">
                                {quiz.questions.map((q, i) => {
                                    const userAnswer = userAnswers[i] || "Not Answered";
                                    const isCorrect = userAnswer.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
                                    return (
                                        <li key={i} className="p-4 border rounded-lg">
                                            <p className="font-semibold">{i+1}. {q.question}</p>
                                            <div className={`flex items-center mt-2 ${isCorrect ? 'text-green-600' : 'text-destructive'}`}>
                                                {isCorrect ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                                                <span className="ml-2">Your answer: {userAnswer}</span>
                                            </div>
                                            {!isCorrect && (
                                                <div className="flex items-center mt-1 text-green-600">
                                                    <CheckCircle2 size={18} />
                                                    <span className="ml-2">Correct answer: {q.correctAnswer}</span>
                                                </div>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </CardContent>
                    </Card>

                    <div className="text-center">
                        <Button onClick={() => router.push('/')}>
                            <Repeat className="mr-2 h-4 w-4" /> Take Another Quiz
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    );
}
