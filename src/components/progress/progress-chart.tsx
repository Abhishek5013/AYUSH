'use client';

import { useState, useEffect } from 'react';
import { getQuizResults } from '@/lib/quiz-store';
import type { QuizResult } from '@/types';
import { useUser } from '@/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Target } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';

export function ProgressChart() {
  const { user, isUserLoading } = useUser();
  const [results, setResults] = useState<QuizResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isUserLoading) return;
    const userResults = getQuizResults(user?.uid);
    setResults(userResults);
    setIsLoading(false);
  }, [user, isUserLoading]);

  if (isLoading || isUserLoading) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Loading Progress...</CardTitle>
            </CardHeader>
            <CardContent className="h-96">
                <div className="w-full h-full bg-muted animate-pulse rounded-md" />
            </CardContent>
        </Card>
    );
  }

  if (results.length === 0) {
    const placeholderImage = PlaceHolderImages[0];
    return (
      <Card className="flex flex-col items-center justify-center text-center p-8">
        {placeholderImage &&
          <Image
            src={placeholderImage.imageUrl}
            alt={placeholderImage.description}
            width={300}
            height={200}
            className="mb-4 rounded-lg object-cover"
            data-ai-hint={placeholderImage.imageHint}
          />
        }
        <Target className="h-12 w-12 text-muted-foreground mb-4" />
        <CardTitle>No Quiz History Found</CardTitle>
        <CardDescription className="mt-2 mb-4">You haven't completed any quizzes yet. Start one to see your progress!</CardDescription>
        <Link href="/" passHref>
          <Button>Take a Quiz</Button>
        </Link>
      </Card>
    );
  }

  const chartData = results.map(result => ({
    name: `${result.topic.substring(0, 15)}${result.topic.length > 15 ? '...' : ''} (${new Date(result.date).toLocaleDateString()})`,
    score: Math.round((result.score / result.totalQuestions) * 100),
    user: result.userName,
  }));

  return (
    <Card>
      <CardHeader>
            <CardTitle>Quiz Performance</CardTitle>
            <CardDescription>Scores are shown as percentages.</CardDescription>
      </CardHeader>
      <CardContent>
        {results.length > 0 ? (
            <div className="h-96 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                    data={chartData}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                    >
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} unit="%" />
                    <Tooltip
                        contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        borderColor: 'hsl(var(--border))'
                        }}
                    />
                    <Legend />
                    <Bar dataKey="score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center text-center p-8 h-96">
                <CardTitle>No Results Found</CardTitle>
                <CardDescription className="mt-2">Complete a quiz to see your progress here.</CardDescription>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
