'use client';

import { PageHeader } from '@/components/common/page-header';
import { QuizCreationForm } from '@/components/quiz/quiz-creation-form';
import { Card, CardContent } from '@/components/ui/card';
import { BrainCircuit } from 'lucide-react';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="flex flex-col h-full">
        <PageHeader
          title="Welcome to QuizWise"
          description="Start your learning journey by generating a quiz on any topic."
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Welcome to QuizWise"
        description="Start your learning journey by generating a quiz on any topic."
      />
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <BrainCircuit className="h-8 w-8 text-primary" />
                <h2 className="text-2xl font-bold font-headline">Create a New Quiz</h2>
              </div>
              <QuizCreationForm />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
