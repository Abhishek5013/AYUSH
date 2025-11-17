import { PageHeader } from '@/components/common/page-header';
import { ProgressChart } from '@/components/progress/progress-chart';

export default function ProgressPage() {
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
