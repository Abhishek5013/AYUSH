import { QuizResultsDisplay } from '@/components/quiz/quiz-results-display';

type QuizResultsPageProps = {
  params: {
    quizId: string;
  };
};

export default function QuizResultsPage({ params }: QuizResultsPageProps) {
  return <QuizResultsDisplay quizId={params.quizId} />;
}
