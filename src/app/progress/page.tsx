'use client';
import { PageHeader } from '@/components/common/page-header';
import { ProgressChart } from '@/components/progress/progress-chart';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProgressPage() {
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
            title="My Progress"
            description="Track your quiz scores over time and see how you're improving."
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <Card>
                <CardHeader>
                    <CardTitle><Skeleton className="h-8 w-1/4" /></CardTitle>
                    <CardDescription><Skeleton className="h-4 w-1/2" /></CardDescription>
                </CardHeader>
                <CardContent className="h-96">
                    <div className="w-full h-full bg-muted animate-pulse rounded-md" />
                </CardContent>
            </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="My Progress"
        description="Track your quiz scores over time and see how you're improving."
      />
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <ProgressChart />
      </main>
    </div>
  );
}

// Dummy Card components for skeleton loading
const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => <div className={className}>{children}</div>;
const CardHeader = ({ children, className }: { children: React.ReactNode, className?: string }) => <div className={`space-y-2 ${className}`}>{children}</div>;
const CardTitle = ({ children, className }: { children: React.ReactNode, className?: string }) => <div className={className}>{children}</div>;
const CardDescription = ({ children, className }: { children: React.ReactNode, className?: string }) => <div className={className}>{children}</div>;
const CardContent = ({ children, className }: { children:React.ReactNode, className?: string }) => <div className={className}>{children}</div>;
